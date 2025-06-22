use sea_orm::entity::prelude::*;
use serde::{ Deserialize, Serialize };

#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Serialize, Deserialize)]
#[sea_orm(table_name = "projects")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub title: String,
    pub description: Option<String>,
    pub color: Option<String>,
    pub client_name: Option<String>,
    pub status: String,
    pub started_at: Option<String>,
    pub deadline: Option<String>,
    pub completed_at: Option<String>,
    pub is_billable: Option<bool>,
    pub billing_type: Option<String>,
    pub hourly_rate: Option<i32>,
    pub fixed_rate: Option<i32>,
    pub currency: Option<String>,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(has_many = "super::task::Entity")]
    Task,
    #[sea_orm(has_many = "super::session::Entity")]
    Session,
    #[sea_orm(has_many = "super::tag::Entity")]
    Tag,
}

impl Related<super::task::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Task.def()
    }
}

impl Related<super::session::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Session.def()
    }
}

impl Related<super::tag::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Tag.def()
    }
}

impl ActiveModelBehavior for ActiveModel {}
