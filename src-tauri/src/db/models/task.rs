use serde::{ Deserialize, Serialize };
use chrono::NaiveDateTime;

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct TaskModel {
    pub id: i32,
    pub title: String,
    pub description: Option<String>,
    pub color: String,
    pub status: String,
    pub project_id: i32,
    pub priority: String,
    pub deadline: Option<NaiveDateTime>,
    pub started_at: NaiveDateTime,
    pub completed_at: Option<NaiveDateTime>,
    pub estimated_time: Option<i64>,
    pub created_at: Option<NaiveDateTime>,
    pub updated_at: Option<NaiveDateTime>,
}
