use ::entity::tasks;
use serde::{ Deserialize, Serialize };

#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
pub struct TaskModel {
    pub id: i32,
    pub title: String,
    pub description: Option<String>,
    pub color: Option<String>,
    pub project_id: i32,
    pub status: String,
    pub priority: String,
    pub deadline: Option<String>,
    pub started_at: String,
    pub completed_at: Option<String>,
    pub estimated_time: Option<i32>,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
pub struct CreateTaskModel {
    pub title: String,
    pub description: Option<String>,
    pub color: Option<String>,
    pub project_id: i32,
    pub status: String,
    pub priority: String,
    pub deadline: Option<String>,
    pub started_at: String,
    pub completed_at: Option<String>,
    pub estimated_time: Option<i32>,
}

#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
pub struct MiniTask {
    pub id: i32,
    pub title: String,
    pub color: Option<String>,
}

impl From<tasks::Model> for MiniTask {
    fn from(task: tasks::Model) -> Self {
        Self {
            id: task.id,
            title: task.title,
            color: task.color,
        }
    }
}
