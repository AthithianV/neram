use ::entity::projects;
use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
pub struct ReadProjectModel {
    pub id: i32,
    pub title: String,
    pub description: Option<String>,
    pub color: String,
    pub client_name: Option<String>,
    pub started_at: Option<String>,
    pub deadline: Option<String>,
    pub completed_at: Option<String>,
    pub is_billable: Option<bool>,
    pub billing_type: Option<String>,
    pub hourly_rate: Option<i32>,
    pub fixed_rate: Option<i32>,
    pub currency: Option<String>,
}

impl From<projects::Model> for ReadProjectModel {
    fn from(project: projects::Model) -> Self {
        Self {
            id: project.id,
            title: project.title,
            description: project.description,
            color: project.color,
            client_name: project.client_name,
            started_at: project.started_at,
            deadline: project.deadline,
            completed_at: project.completed_at,
            is_billable: project.is_billable,
            billing_type: project.billing_type,
            hourly_rate: project.hourly_rate,
            fixed_rate: project.fixed_rate,
            currency: project.currency,
        }
    }
}

#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
pub struct CreateProjectModel {
    pub title: String,
    pub description: Option<String>,
    pub color: String,
    pub client_name: Option<String>,
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
