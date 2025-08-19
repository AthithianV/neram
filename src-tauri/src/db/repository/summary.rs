use crate::models::summary::{CountResult, DaySummary, LifeTimeSummary, SessionSummary, Streak};
use sea_orm::{
    sea_query::Expr, ColumnTrait, DatabaseConnection, DbErr, EntityTrait, QueryFilter, QueryOrder,
    QuerySelect,
};

use ::entity::{
    projects::{Column as ProjectColumn, Entity as Project},
    sessions::{Column as SessionColumn, Entity as Session},
    tasks::{Column as TaskColumn, Entity as Task},
};
use chrono::{Duration, Local, NaiveDate, NaiveDateTime};

pub struct SummaryRepository<'a> {
    db: &'a DatabaseConnection,
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
                Expr::sum(Expr::col(SessionColumn::BreakDurationSec)),
                "total_duration_sec",
            )
            .into_tuple()
            .one(self.db)
            .await?;

        let (count, total_duration_sec) = row.unwrap_or((0, 0));

        Ok(DaySummary {
            count: count as i32,
            total_duration_sec: total_duration_sec as i32,
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
}
