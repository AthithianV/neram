use sea_orm::entity::prelude::*;
use serde::{ Deserialize, Serialize };

#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Serialize, Deserialize)]
#[sea_orm(table_name = "pomodoro_settings")]
pub struct Model {
    pub session_duration: Option<i32>,
    pub session_count: Option<i32>,
    pub break_duration: Option<i32>,
    pub auto_start: Option<bool>,
    pub sync_with_time_tracking: Option<bool>,
}

impl ActiveModelBehavior for ActiveModel {}
