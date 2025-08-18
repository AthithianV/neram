use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct DaySummary {
    pub count: i32,
    pub total_duration_sec: i32,
}
