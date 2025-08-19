use crate::models::summary::{DaySummary, LifeTimeSummary, MonthlySummary, Streak};
use sea_orm::{
    sea_query::Expr, ColumnTrait, DatabaseConnection, DbErr, EntityTrait, FromQueryResult,
    QueryFilter, QueryOrder, QuerySelect,
};
use std::collections::HashMap;

use ::entity::{
    projects::{Column as ProjectColumn, Entity as Project},
    sessions::{Column as SessionColumn, Entity as Session},
    tasks::{Column as TaskColumn, Entity as Task},
};
use chrono::{Datelike, Duration, Local, NaiveDate, NaiveDateTime};

pub struct SummaryRepository<'a> {
    db: &'a DatabaseConnection,
}

#[derive(Debug, FromQueryResult)]
struct DailySessionSummary {
    date: NaiveDate,
    session_count: Option<i64>,
    total_duration_sec: Option<i64>,
}

#[derive(Debug, FromQueryResult)]
struct DailyTaskSummary {
    date: NaiveDate,
    completed_task_count: Option<i64>,
}

#[derive(Debug, FromQueryResult)]
struct SessionSummary {
    duration_sec: Option<i64>,
    session_count: Option<i64>,
    focused_day_count: Option<i64>,
}

#[derive(Debug, FromQueryResult)]
struct CountResult {
    count: Option<i64>,
}

impl<'a> SummaryRepository<'a> {
    pub fn new(db: &'a DatabaseConnection) -> Self {
        Self { db }
    }

    pub async fn get_day_summary(&self, date: NaiveDateTime) -> Result<DaySummary, DbErr> {
        let row: Option<(i64, i64)> = Session::find()
            .filter(SessionColumn::Date.eq(date))
            .select_only()
            .column_as(Expr::count(Expr::col(SessionColumn::Id)), "count")
            .column_as(
                Expr::cust("COALESCE(SUM(session_duration_sec), 0)"),
                "total_duration_sec",
            )
            .into_tuple()
            .one(self.db)
            .await?;

        let (count, total_duration_sec) = row.unwrap_or((0, 0));

        Ok(DaySummary {
            count: count,
            total_duration_sec: total_duration_sec,
        })
    }

    pub async fn get_streaks(&self) -> Result<Streak, sea_orm::DbErr> {
        use entity::sessions;

        // 1. Fetch distinct dates of sessions
        let mut dates: Vec<NaiveDate> = sessions::Entity::find()
            .select_only()
            .column(sessions::Column::Date)
            .order_by_asc(sessions::Column::Date)
            .into_tuple::<NaiveDateTime>() // extract DateTime
            .all(self.db)
            .await?
            .into_iter()
            .map(|dt| dt.date()) // convert to NaiveDate
            .collect();

        dates.dedup(); // ensure distinct days

        // 2. Iterate for streaks
        let mut max_streak = 0;
        let mut streak = 1;

        for i in 1..dates.len() {
            if dates[i] == dates[i - 1] + Duration::days(1) {
                streak += 1;
            } else {
                streak = 1;
            }
            max_streak = max_streak.max(streak);
        }

        // 3. Calculate current streak (count backwards until gap)
        let today = Local::now().naive_local().date();
        let mut current_streak = 0;

        for i in (0..dates.len()).rev() {
            let expected = today - Duration::days(current_streak as i64);
            if dates[i] == expected {
                current_streak += 1;
            } else if dates[i] < expected {
                break;
            }
        }

        Ok(Streak {
            current_streak: current_streak,
            total_streak: max_streak,
        })
    }

    pub async fn get_life_time_summary(&self) -> Result<LifeTimeSummary, DbErr> {
        let session = Session::find()
            .select_only()
            .column_as(
                Expr::col(SessionColumn::SessionDurationSec).sum(),
                "duration_sec",
            )
            .column_as(Expr::col(SessionColumn::Id).count(), "session_count")
            .column_as(
                Expr::cust("COUNT(DISTINCT DATE(date))"),
                "focused_day_count",
            )
            .filter(SessionColumn::EndTime.is_not_null())
            .into_model::<SessionSummary>()
            .one(self.db)
            .await?
            .unwrap_or(SessionSummary {
                duration_sec: Some(0),
                session_count: Some(0),
                focused_day_count: Some(0),
            });

        // Projects count
        let project_count = Project::find()
            .select_only()
            .column_as(Expr::col(ProjectColumn::Id).count(), "count")
            .into_model::<CountResult>()
            .one(self.db)
            .await?
            .unwrap_or(CountResult { count: Some(0) });

        // Completed tasks count
        let task_count = Task::find()
            .select_only()
            .column_as(Expr::col(TaskColumn::Id).count(), "count")
            .filter(TaskColumn::CompletedAt.is_not_null())
            .into_model::<CountResult>()
            .one(self.db)
            .await?
            .unwrap_or(CountResult { count: Some(0) });

        Ok(LifeTimeSummary {
            duration_sec: session.duration_sec.unwrap_or(0),
            session_count: session.session_count.unwrap_or(0),
            focused_day_count: session.focused_day_count.unwrap_or(0),
            completed_task_count: task_count.count.unwrap_or(0),
            project_count: project_count.count.unwrap_or(0),
        })
    }

    pub async fn get_monthly_summary(
        &self,
        year: i32,
        month: u32,
    ) -> Result<Vec<MonthlySummary>, DbErr> {
        // --- 1. Find start and end date of month ---
        let start = NaiveDate::from_ymd_opt(year, month, 1).unwrap();
        let end = if month == 12 {
            NaiveDate::from_ymd_opt(year + 1, 1, 1).unwrap()
        } else {
            NaiveDate::from_ymd_opt(year, month + 1, 1).unwrap()
        };

        // --- 2. Query sessions grouped by day ---
        let sessions = Session::find()
            .select_only()
            .column_as(Expr::cust("DATE(date)"), "date")
            .column_as(Expr::col(SessionColumn::Id).count(), "session_count")
            .column_as(
                Expr::cust("COALESCE(SUM(session_duration_sec), 0)"),
                "total_duration_sec",
            )
            .filter(SessionColumn::Date.gte(start.and_hms_opt(0, 0, 0).unwrap()))
            .filter(SessionColumn::Date.lt(end.and_hms_opt(0, 0, 0).unwrap()))
            .filter(SessionColumn::EndTime.is_not_null())
            .group_by(Expr::cust("DATE(date)"))
            .into_model::<DailySessionSummary>()
            .all(self.db)
            .await?;

        // --- 3. Query completed tasks grouped by day ---
        let tasks = Task::find()
            .select_only()
            .column_as(Expr::cust("DATE(completed_at)"), "date")
            .column_as(Expr::cust("COUNT(id)"), "completed_task_count")
            .filter(TaskColumn::CompletedAt.gte(start.and_hms_opt(0, 0, 0).unwrap()))
            .filter(TaskColumn::CompletedAt.lt(end.and_hms_opt(0, 0, 0).unwrap()))
            .group_by(Expr::cust("DATE(completed_at)"))
            .into_model::<DailyTaskSummary>()
            .all(self.db)
            .await?;

        // --- 4. Build maps for fast lookup ---
        let session_map: HashMap<NaiveDate, (i64, i64)> = sessions
            .into_iter()
            .map(|s| {
                (
                    s.date,
                    (
                        s.session_count.unwrap_or(0),
                        s.total_duration_sec.unwrap_or(0),
                    ),
                )
            })
            .collect();

        let task_map: HashMap<NaiveDate, i64> = tasks
            .into_iter()
            .map(|t| (t.date, t.completed_task_count.unwrap_or(0)))
            .collect();

        // --- 5. Generate all days in month ---
        let mut summaries = Vec::new();
        let mut current = start;
        while current < end {
            let (session_count, total_duration_sec) =
                session_map.get(&current).cloned().unwrap_or((0, 0));
            let completed_task_count = task_map.get(&current).cloned().unwrap_or(0);

            summaries.push(MonthlySummary {
                date: (current.year() as i64) * 10_000
                    + (current.month() as i64) * 100
                    + (current.day() as i64),
                session_count,
                total_duration_sec,
                completed_task_count,
            });

            current = current.succ_opt().unwrap(); // move to next day
        }

        Ok(summaries)
    }
}
