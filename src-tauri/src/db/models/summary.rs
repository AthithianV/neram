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

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct MonthlySummary {
    pub date: i64,
    pub session_count: i64,
    pub total_duration_sec: i64,
    pub completed_task_count: i64,
}
