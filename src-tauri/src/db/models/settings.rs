use sea_orm::entity::prelude::*;
use serde::{ Deserialize, Serialize };

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum Theme {
    Dark,
    Light,
    System,
}

#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
pub struct SettingsModel {
    pub id: i32,
    pub theme: Option<String>,
    pub date_format: Option<String>,
    pub time_format: Option<String>,
}
