use sea_orm::entity::prelude::*;
use serde::{ Deserialize, Serialize };
use crate::models::session;

pub type TaskModel = Model;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Serialize, Deserialize)]
#[sea_orm(table_name = "tasks")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub title: String,
    pub description: Option<String>,
    pub color: Option<String>,
    pub project_id: i32,
    pub status: String,
    pub priority: String,
    pub deadline: Option<String>,
    pub started_at: String,
    pub completed_at: Option<String>,
    pub estimated_time: Option<i32>,
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
    Project
}

impl ActiveModelBehavior for ActiveModel {}
