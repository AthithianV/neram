use sea_orm::entity::prelude::*;
use serde::{ Deserialize, Serialize };

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum Theme {
    Dark,
    Light,
    System,
}

#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Serialize, Deserialize)]
#[sea_orm(table_name = "settings")]
pub struct Model {
    pub theme: Option<String>,
    pub date_format: Option<String>,
    pub time_format: Option<String>,
}

impl ActiveModelBehavior for ActiveModel {}
