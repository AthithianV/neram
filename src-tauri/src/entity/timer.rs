use sea_orm::entity::prelude::*;

#[derive(Debug, Clone, EnumIter, DeriveActiveEnum, PartialEq, Eq)]
#[sea_orm(rs_type = "String", db_type = "Text")]
pub enum TimerType {
    #[sea_orm(string_value = "SESSION")]
    Session,
    #[sea_orm(string_value = "BREAK")]
    Break,
    #[sea_orm(string_value = "POMODARO")]
    Pomodaro,
}

#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "timer")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub is_running: bool,
    pub timer_type: TimerType,
    pub duration: f64,
    pub created_at: DateTimeWithTimeZone,
    pub updated_at: DateTimeWithTimeZone,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {}
impl ActiveModelBehavior for ActiveModel {}
