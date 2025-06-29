use sea_orm::entity::prelude::*;
use sea_orm::Related;
use serde::{ Deserialize, Serialize };
use crate::models::project;
use crate::models::task;
use chrono::{ NaiveDateTime };

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
    pub date: NaiveDateTime,
    pub start_time: NaiveDateTime,
    pub end_time: Option<NaiveDateTime>,
    pub session_duration_sec: i32,
    pub break_duration_sec: i32,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(
        belongs_to = "super::project::Entity",
        from = "Column::ProjectId",
        to = "super::project::Column::Id"
    )]
    Project,

    #[sea_orm(
        belongs_to = "super::task::Entity",
        from = "Column::TaskId",
        to = "super::task::Column::Id"
    )]
    Task,
}

impl Related<task::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Task.def()
    }
}

impl Related<project::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Project.def()
    }
}

impl ActiveModelBehavior for ActiveModel {}

// Additional structs for related data
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct TaskInfo {
    pub id: i32,
    pub title: String,
    pub color: String,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct ProjectInfo {
    pub id: i32,
    pub title: String,
    pub color: String,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct TagInfo {
    pub id: i32,
    pub title: String,
    pub color: String,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct SessionWithRelationStruct {
    pub id: i32,
    pub title: Option<String>,
    pub description: Option<String>,
    pub task: TaskInfo,
    pub project: ProjectInfo,
    pub tags: Vec<TagInfo>,
    pub date: NaiveDateTime,
    pub start_time: NaiveDateTime,
    pub end_time: Option<NaiveDateTime>,
    pub session_duration_sec: i32,
    pub break_duration_sec: i32,
}
