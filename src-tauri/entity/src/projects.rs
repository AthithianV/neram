use chrono::{NaiveDate, NaiveDateTime};
use sea_orm::entity::prelude::*;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Eq)]
#[sea_orm(table_name = "projects")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub title: String,
    pub description: Option<String>,
    pub color: String,
    pub client_name: Option<String>,
    pub started_at: Option<NaiveDate>,
    pub deadline: Option<NaiveDateTime>,
    pub completed_at: Option<NaiveDate>,
    pub is_billable: Option<bool>,
    pub billing_type: Option<String>,
    pub hourly_rate: Option<i32>,
    pub fixed_rate: Option<i32>,
    pub currency: Option<String>,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(has_many = "super::projects_tags::Entity")]
    ProjectsTags,
    #[sea_orm(has_many = "super::sessions::Entity")]
    Sessions,
    #[sea_orm(has_many = "super::tasks::Entity")]
    Tasks,
}

impl Related<super::projects_tags::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::ProjectsTags.def()
    }
}

impl Related<super::sessions::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Sessions.def()
    }
}

impl Related<super::tasks::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Tasks.def()
    }
}

impl Related<super::tags::Entity> for Entity {
    fn to() -> RelationDef {
        super::projects_tags::Relation::Tags.def()
    }
    fn via() -> Option<RelationDef> {
        Some(super::projects_tags::Relation::Projects.def().rev())
    }
}

impl ActiveModelBehavior for ActiveModel {}
