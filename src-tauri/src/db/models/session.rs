use sea_orm::entity::prelude::*;
use serde::{ Deserialize, Serialize };

pub type SessionModel = Model;
pub type SessionWithRelation = SessionWithRelationStruct;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Serialize, Deserialize)]
#[sea_orm(table_name = "sessions")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub title: Option<String>,
    pub description: Option<String>,
    pub project_id: i32,
    pub task_id: i32,
    pub date: String,
    pub start_time: String,
    pub end_time: Option<String>,
    pub session_duration_sec: i32,
    pub break_duration_sec: i32,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {}

impl ActiveModelBehavior for ActiveModel {}

// Additional structs for related data
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Related {
    pub id: i32,
    pub title: String,
    pub color: Option<String>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct SessionWithRelationStruct {
    pub id: i32,
    pub title: Option<String>,
    pub description: Option<String>,
    pub task: Related,
    pub project: Related,
    pub tags: Vec<Related>,
    pub date: String,
    pub start_time: String,
    pub end_time: Option<String>,
    pub session_duration_sec: i32,
    pub break_duration_sec: i32,
}
