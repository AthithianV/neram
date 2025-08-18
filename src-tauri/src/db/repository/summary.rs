use crate::models::summary::DaySummary;
use chrono::NaiveDateTime;
use sea_orm::{
    sea_query::Expr, ColumnTrait, DatabaseConnection, DbErr, EntityTrait, QueryFilter, QuerySelect,
};

use ::entity::sessions::{Column as SessionColumn, Entity as Session};

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
}
