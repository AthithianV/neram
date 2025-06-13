use serde::{ Deserialize, Serialize };
use chrono::NaiveDateTime;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum TaskStatus {
    Planning,
    InProgress,
    Completed,
    Cancelled,
    OnHold
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum PriorityType{
    Low,
    Medium,
    High,
    Urgent
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct TaskModel {
    pub id: i32,
    pub title: String,
    pub description: Option<String>,
    pub color: String,
    pub status: TaskStatus,
    pub project_id: i32,
    pub priority: PriorityType,
    pub deadline: Option<NaiveDateTime>,
    pub started_at: Option<NaiveDateTime>,
    pub completed_at: Option<NaiveDateTime>,
    pub estimated_time: Option<u64>,
    pub created_at: Option<NaiveDateTime>,
    pub updated_at: Option<NaiveDateTime>,
}
