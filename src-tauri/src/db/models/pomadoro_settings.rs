use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
pub struct PomadoroSettingsModel {
    pub id: i32,
    pub session_duration: Option<i32>,
    pub session_count: Option<i32>,
    pub break_duration: Option<i32>,
    pub auto_start: Option<bool>,
    pub sync_with_time_tracking: Option<bool>,
}
