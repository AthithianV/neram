use chrono::NaiveDateTime;
use sea_orm::entity::prelude::*;
use sea_orm::EnumIter;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Copy, PartialEq, Eq, EnumIter, DeriveActiveEnum, Serialize, Deserialize)]
#[sea_orm(rs_type = "i32", db_type = "Integer")]
pub enum Priority {
    #[sea_orm(num_value = 1)]
    Critical,
    #[sea_orm(num_value = 2)]
    High,
    #[sea_orm(num_value = 3)]
    Medium,
    #[sea_orm(num_value = 4)]
    Low,
}

#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Eq)]
#[sea_orm(table_name = "tasks")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub title: String,
    pub description: Option<String>,
    pub project_id: i32,
    pub status: String,
    pub priority: Option<Priority>,
    pub deadline: Option<NaiveDateTime>,
    pub started_at: NaiveDateTime,
    pub completed_at: Option<NaiveDateTime>,
    pub estimated_time: Option<i32>,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(
        belongs_to = "super::projects::Entity",
        from = "Column::ProjectId",
        to = "super::projects::Column::Id",
        on_update = "Cascade",
        on_delete = "Cascade"
    )]
    Projects,
    #[sea_orm(has_many = "super::tasks_tags::Entity")]
    TasksTags,
    #[sea_orm(has_many = "super::sessions::Entity")]
    Sessions,
}

impl Related<super::projects::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Projects.def()
    }
}

impl Related<super::tasks_tags::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::TasksTags.def()
    }
}

impl Related<super::tags::Entity> for Entity {
    fn to() -> RelationDef {
        super::tasks_tags::Relation::Tags.def()
    }
    fn via() -> Option<RelationDef> {
        Some(super::tasks_tags::Relation::Tasks.def().rev())
    }
}

impl Related<super::sessions::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Sessions.def()
    }
}

impl ActiveModelBehavior for ActiveModel {}
