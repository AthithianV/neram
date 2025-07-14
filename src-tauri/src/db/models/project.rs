use serde::{ Deserialize, Serialize };
use ::entity::projects;

#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
pub struct ProjectModel {
    pub id: i32,
    pub title: String,
    pub description: Option<String>,
    pub color: Option<String>,
    pub client_name: Option<String>,
    pub status: String,
    pub started_at: Option<String>,
    pub deadline: Option<String>,
    pub completed_at: Option<String>,
    pub is_billable: Option<bool>,
    pub billing_type: Option<String>,
    pub hourly_rate: Option<i32>,
    pub fixed_rate: Option<i32>,
    pub currency: Option<String>,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
pub struct CreateProjectModel {
    pub title: String,
    pub description: Option<String>,
    pub color: String,
    pub client_name: Option<String>,
    pub status: String,
    pub started_at: Option<String>,
    pub deadline: Option<String>,
    pub completed_at: Option<String>,
    pub is_billable: Option<bool>,
    pub billing_type: Option<String>,
    pub hourly_rate: Option<i32>,
    pub fixed_rate: Option<i32>,
    pub currency: Option<String>,
}

#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
pub struct MinimalProjectModel {
    pub id: i32,
    pub title: String,
    pub color: String,
}

impl From<projects::Model> for MinimalProjectModel {
    fn from(project: projects::Model) -> Self {
        Self {
            id: project.id,
            title: project.title,
            color: project.color,
        }
    }
}
