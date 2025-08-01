use ::entity::tasks;
use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
pub struct ReadTaskModel {
    pub id: i32,
    pub title: String,
    pub description: Option<String>,
    pub project_id: i32,
    pub status: String,
    pub priority: Option<String>,
    pub deadline: Option<NaiveDateTime>,
    pub started_at: NaiveDateTime,
    pub completed_at: Option<NaiveDateTime>,
    pub estimated_time: Option<i32>,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

impl From<tasks::Model> for ReadTaskModel {
    fn from(task: tasks::Model) -> Self {
        Self {
            id: task.id,
            title: task.title,
            description: task.description,
            project_id: task.project_id,
            status: task.status,
            priority: task.priority,
            deadline: task.deadline,
            started_at: task.started_at,
            completed_at: task.completed_at,
            estimated_time: task.estimated_time,
            created_at: task.created_at,
            updated_at: task.updated_at,
        }
    }
}

#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
pub struct CreateTaskModel {
    pub title: String,
    pub description: Option<String>,
    pub project_id: i32,
    pub status: String,
    pub priority: Option<String>,
    pub deadline: Option<NaiveDateTime>,
    pub started_at: NaiveDateTime,
    pub completed_at: Option<NaiveDateTime>,
    pub estimated_time: Option<i32>,
}
