use sea_orm::entity::prelude::*;
use serde::{ Deserialize, Serialize };

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
    #[sea_orm(has_many = "super::tag::Entity")]
    Tag,
}

impl Related<super::project::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Project.def()
    }
}

impl Related<super::task::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Task.def()
    }
}

impl Related<super::tag::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Tag.def()
    }
}

impl ActiveModelBehavior for ActiveModel {}

// Additional structs for related data
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Related {
    pub id: i32,
    pub title: String,
    pub color: Option<String>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct SessionWithRelation {
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
