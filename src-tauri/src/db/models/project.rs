use serde::{ Deserialize, Serialize };
use chrono::NaiveDateTime;

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct ProjectModel {
    pub id: i32,

    pub title: String,
    pub description: Option<String>,
    pub color: String,

    pub client_name: Option<String>,
    pub status: String,

    pub is_billable: Option<bool>,
    pub billing_type: Option<String>,
    pub hourly_rate: Option<i32>,
    pub fixed_rate: Option<i32>,
    pub currency: Option<String>,

    pub deadline: Option<NaiveDateTime>,
    pub started_at: Option<NaiveDateTime>,
    pub completed_at: Option<NaiveDateTime>,

    pub created_at: Option<NaiveDateTime>,
    pub updated_at: Option<NaiveDateTime>,
}
