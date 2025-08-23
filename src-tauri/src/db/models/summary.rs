use chrono::NaiveDate;
use serde::{Deserialize, Serialize};

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
pub struct DaySummary {
    pub date: NaiveDate,
    pub session_count: i64,
    pub total_duration_sec: i64,
    pub completed_task_count: i64,
}

#[derive(Debug, Serialize, Clone)]
pub struct MonthlySummary {
    pub total_days_worked: i64,
    pub avg_duration_per_day: f64,
    pub total_duration_sec: i64,
    pub session_count: i64,
}

#[derive(Debug, Serialize, Clone)]
pub struct CalendarView {
    pub days: Vec<Option<DaySummary>>,
}

#[derive(Debug, Serialize)]
pub struct MonthlyReport {
    pub calendar_view: Vec<CalendarView>,
    pub monthly_summary: MonthlySummary,
}
