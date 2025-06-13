use serde::{ Deserialize, Serialize };
use chrono::NaiveDateTime;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum ProjectStatus {
    Active,
    Completed,
    Cancelled,
    OnHold,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum BillingType{
    Hourly,
    Fixed
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct ProjectModel {
    pub id: i32,

    pub title: String,
    pub description: Option<String>,
    pub color: String,

    pub client_name: Option<String>,
    pub status: ProjectStatus,

    pub is_billable: Option<bool>,
    pub billing_type: Option<BillingType>,
    pub hourly_rate: Option<u32>,
    pub fixed_rate: Option<u32>,
    pub currency: Option<String>,
    
    pub deadline: Option<NaiveDateTime>,
    pub started_at: Option<NaiveDateTime>,
    pub completed_at: Option<NaiveDateTime>,

    pub created_at: Option<NaiveDateTime>,
    pub updated_at: Option<NaiveDateTime>
}
