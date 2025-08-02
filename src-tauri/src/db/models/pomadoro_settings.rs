use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
pub struct ReadPomadoroSettings {
    pub session_duration: i32,
    pub session_count: i32,
    pub break_duration: i32,
    pub auto_start: bool,
    pub sync_with_time_tracking: bool,
}

#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
pub struct UpdatePomadoroSettings {
    pub session_duration: Option<i32>,
    pub session_count: Option<i32>,
    pub break_duration: Option<i32>,
    pub auto_start: Option<bool>,
    pub sync_with_time_tracking: Option<bool>,
}
