use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
pub struct ReadPomodoroSettings {
    pub session_duration: i32,
    pub session_count: i32,
    pub break_duration: i32,
    pub auto_start: bool,
    pub notification_sound: bool,
    pub sync_with_time_tracking: bool,
    pub session_completed: i32,
    pub break_completed: i32,
    pub default_project: Option<i32>,
}

#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
pub struct UpdatePomodoroSettings {
    pub session_duration: Option<i32>,
    pub session_count: Option<i32>,
    pub break_duration: Option<i32>,
    pub auto_start: Option<bool>,
    pub notification_sound: Option<bool>,
    pub sync_with_time_tracking: Option<bool>,
    pub session_completed: Option<i32>,
    pub default_project: Option<Option<i32>>,
    pub break_completed: Option<i32>,
}
