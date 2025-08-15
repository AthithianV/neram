use chrono::NaiveDateTime;
use entity::tasks::Priority;
use sea_orm::FromQueryResult;
use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, PartialEq, Serialize, Deserialize, FromQueryResult)]
pub struct ReadTaskModel {
    pub id: i32,
    pub title: String,
    pub description: Option<String>,
    pub project_id: i32,
    pub status: String,
    pub priority: Option<Priority>,
    pub deadline: Option<NaiveDateTime>,
    pub started_at: NaiveDateTime,
    pub completed_at: Option<NaiveDateTime>,
    pub estimated_time: Option<i32>,
    pub total_duration_sec: Option<i64>,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
pub struct CreateTaskModel {
    pub title: String,
    pub description: Option<String>,
    pub project_id: i32,
    pub status: String,
    pub priority: Option<Priority>,
    pub deadline: Option<NaiveDateTime>,
    pub started_at: NaiveDateTime,
    pub completed_at: Option<NaiveDateTime>,
    pub estimated_time: Option<i32>,
}
