use serde::{ Deserialize, Serialize };
use chrono::{ NaiveDateTime };
use crate::models::tag::TagModel;

#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
pub struct CreateSessionModel {
    pub title: Option<String>,
    pub description: Option<String>,
    pub project_id: i32,
    pub task_id: i32,
    pub date: NaiveDateTime,
    pub start_time: NaiveDateTime,
    pub end_time: Option<NaiveDateTime>,
    pub session_duration_sec: i32,
    pub break_duration_sec: i32,
    pub tags: Vec<i32>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Extra {
    pub id: i32,
    pub title: String,
    pub color: String,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct FullSessionModel {
    pub id: i32,
    pub title: Option<String>,
    pub description: Option<String>,
    pub task: Extra,
    pub project: Extra,
    pub tags: Vec<TagModel>,
    pub date: NaiveDateTime,
    pub start_time: NaiveDateTime,
    pub end_time: Option<NaiveDateTime>,
    pub session_duration_sec: i32,
    pub break_duration_sec: i32,
}
