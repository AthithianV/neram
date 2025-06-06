use sea_orm::entity::prelude::*;

// pomodaro
#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "pomodaro")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub duration: f64,
    #[sea_orm(column_name = "sessionDuration")]
    pub session_duration: f64,
    #[sea_orm(column_name = "sessionCount")]
    pub session_count: i32,
    #[sea_orm(column_name = "breakDuration")]
    pub break_duration: f64,
    #[sea_orm(column_name = "autoStart")]
    pub auto_start: bool,
    #[sea_orm(column_name = "syncWithTimeTracking")]
    pub sync_with_time_tracking: bool,
    pub created_at: DateTimeWithTimeZone,
    pub updated_at: DateTimeWithTimeZone,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {}
impl ActiveModelBehavior for ActiveModel {}