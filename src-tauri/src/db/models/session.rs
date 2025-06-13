use serde::{ Deserialize, Serialize };
use chrono::NaiveDateTime;

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct SessionModel {
    pub id: u32,
    pub title: Option<String>,
    pub description: Option<String>,

    pub task_id: u32,
    pub project_id: u32,

    pub date: NaiveDateTime,
    pub start_time: NaiveDateTime,
    pub end_time: Option<NaiveDateTime>,

    pub session_duration_sec: i64,
    pub break_duration_sec: i64,

    pub created_at: Option<NaiveDateTime>,
    pub updated_at: Option<NaiveDateTime>,
}

pub struct Related{
    pub title: String,
    pub color: String
}

pub struct SessioWithRelation {
    pub id: u32,
    pub title: Option<String>,
    pub description: Option<String>,

    pub task: Related,
    pub project: Related,
    pub tags: Vec<Related>,

    pub date: NaiveDateTime,
    pub start_time: NaiveDateTime,
    pub end_time: Option<NaiveDateTime>,

    pub session_duration_sec: i64,
    pub break_duration_sec: i64,

}


