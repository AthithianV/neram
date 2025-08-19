use sea_orm::FromQueryResult;
use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct DaySummary {
    pub count: i32,
    pub total_duration_sec: i32,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Streak {
    pub current_streak: i32,
    pub total_streak: i32,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct LifeTimeSummary {
    pub duration_sec: i64,
    pub session_count: i64,
    pub focused_day_count: i64,
    pub completed_task_count: i64,
    pub project_count: i64,
}

#[derive(Debug, FromQueryResult)]
pub struct SessionSummary {
    pub duration_sec: Option<i64>,
    pub session_count: Option<i64>,
    pub focused_day_count: Option<i64>,
}

#[derive(Debug, FromQueryResult)]
pub struct CountResult {
    pub count: Option<i64>,
}
