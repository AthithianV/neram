use serde::{Deserialize, Serialize};


// pomodaro
#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
pub struct PomodoroSettingsModel {
    pub duration: f64,
    pub session_duration: f64,
    pub session_count: i32,
    pub break_duration: f64,
    pub auto_start: bool,
    pub sync_with_time_tracking: bool,
}
