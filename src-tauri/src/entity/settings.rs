use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum Theme {
    Dark,
    Light,
    System,
}

// settings
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct SettingsModel {
    pub theme: Theme,
    pub date_format: String,
    time_format: String
}
