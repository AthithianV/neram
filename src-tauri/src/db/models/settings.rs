use ::entity::settings::Model as Settings;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum Theme {
    Dark,
    Light,
    System,
}

#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
pub struct ReadSettingsModel {
    pub theme: String,
    pub date_format: String,
    pub time_format: String,
}

impl From<Settings> for ReadSettingsModel {
    fn from(settings: Settings) -> Self {
        ReadSettingsModel {
            theme: settings.theme,
            date_format: settings.date_format,
            time_format: settings.time_format,
        }
    }
}
