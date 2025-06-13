use serde::{ Deserialize, Serialize };
use chrono::NaiveDateTime;

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct TagModel {
    pub id: i32,
    pub title: String,
    pub description: Option<String>,
    pub color: String,

    pub created_at: Option<NaiveDateTime>,
    pub updated_at: Option<NaiveDateTime>,
}
