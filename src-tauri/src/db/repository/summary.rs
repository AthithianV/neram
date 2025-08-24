use crate::models::summary::{
    CalendarView, DaySummary, LifeTimeSummary, MonthlyReport, MonthlySummary, Streak,
};
use sea_orm::{
    sea_query::Expr, ColumnTrait, DatabaseConnection, DbErr, EntityTrait, FromQueryResult,
    QueryFilter, QueryOrder, QuerySelect,
};
use std::{collections::HashMap, vec};

use ::entity::{
    projects::{Column as ProjectColumn, Entity as Project},
    sessions::{Column as SessionColumn, Entity as Session},
    tasks::{Column as TaskColumn, Entity as Task},
};
use chrono::{Datelike, Duration, Local, NaiveDate};

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

    pub async fn get_day_summary(&self, date: NaiveDate) -> Result<DaySummary, DbErr> {
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

        let (session_count, total_duration_sec) = row.unwrap_or((0, 0));

        let task_row: Option<i64> = Task::find()
            .filter(TaskColumn::CompletedAt.eq(date))
            .select_only()
            .column_as(Expr::count(Expr::col(TaskColumn::Id)), "count")
            .into_tuple()
            .one(self.db)
            .await?;

        let completed_task_count = task_row.unwrap_or(0);

        Ok(DaySummary {
            date: date,
            session_count,
            completed_task_count,
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
            .into_tuple::<NaiveDate>()
            .all(self.db)
            .await?
            .into_iter()
            .map(|dt| dt)
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

    pub async fn get_daily_summary(
        &self,
        start: NaiveDate,
        end: NaiveDate,
    ) -> Result<Vec<DaySummary>, DbErr> {
        // --- 2. Query sessions grouped by day ---
        let sessions = Session::find()
            .select_only()
            .column_as(Expr::cust("DATE(date)"), "date")
            .column_as(Expr::col(SessionColumn::Id).count(), "session_count")
            .column_as(
                Expr::cust("COALESCE(SUM(session_duration_sec), 0)"),
                "total_duration_sec",
            )
            .filter(SessionColumn::Date.gte(start))
            .filter(SessionColumn::Date.lt(end))
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

            summaries.push(DaySummary {
                date: current,
                session_count,
                total_duration_sec,
                completed_task_count,
            });

            current = current.succ_opt().unwrap(); // move to next day
        }

        Ok(summaries)
    }

    pub async fn get_monthly_summary(
        &self,
        start: NaiveDate,
        end: NaiveDate,
    ) -> Result<MonthlySummary, DbErr> {
        let sessions_summary: Option<(i64, i64)> = Session::find()
            .select_only()
            .column_as(
                Expr::cust("COUNT(DISTINCT DATE(date))"),
                "total_days_worked",
            )
            .column_as(
                Expr::cust("COALESCE(SUM(session_duration_sec), 0)"),
                "total_duration_sec",
            )
            .filter(SessionColumn::Date.gte(start))
            .filter(SessionColumn::Date.lt(end))
            .filter(SessionColumn::EndTime.is_not_null())
            .group_by(Expr::cust("DATE(date)"))
            .into_tuple()
            .one(self.db)
            .await?;

        let (total_days_worked, total_duration_sec) = sessions_summary.unwrap_or((0, 0));

        let avg_duration_per_day = if total_days_worked > 0 {
            total_duration_sec as f64 / total_days_worked as f64
        } else {
            0.0
        };

        let result = MonthlySummary {
            total_days_worked,
            total_duration_sec,
            avg_duration_per_day,
            session_count: 0,
        };

        Ok(result)
    }

    pub async fn get_monthly_report(&self, year: i32, month: u32) -> Result<MonthlyReport, DbErr> {
        let start = NaiveDate::from_ymd_opt(year, month, 1).unwrap();
        let end = if month == 12 {
            NaiveDate::from_ymd_opt(year + 1, 1, 1).unwrap()
        } else {
            NaiveDate::from_ymd_opt(year, month + 1, 1).unwrap()
        };

        let monthly_summary = self.get_monthly_summary(start, end).await?;

        let daily_summaries = self.get_daily_summary(start, end).await?;
        if daily_summaries.is_empty() {
            return Ok(MonthlyReport {
                calendar_view: vec![],
                monthly_summary,
            });
        }

        // --- Parse date of first & last ---
        let first_date = daily_summaries.first().unwrap().date;

        let first_weekday = first_date.weekday().num_days_from_sunday() as usize;
        let mut calendar: Vec<Option<DaySummary>> = Vec::new();

        // --- Leading blanks ---
        for _ in 0..first_weekday {
            calendar.push(None);
        }

        // --- Fill daily_summaries ---
        for s in daily_summaries {
            calendar.push(Some(s));
        }

        // --- Trailing blanks ---
        while calendar.len() % 7 != 0 {
            calendar.push(None);
        }

        // --- Chunk into weeks ---
        let weeks: Vec<CalendarView> = calendar
            .chunks(7)
            .map(|chunk| CalendarView {
                days: chunk.to_vec(),
            })
            .collect();

        Ok(MonthlyReport {
            calendar_view: weeks,
            monthly_summary: monthly_summary,
        })
    }
}
