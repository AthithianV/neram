use chrono::{NaiveDate, NaiveDateTime};
use sea_orm::entity::prelude::*;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Eq)]
#[sea_orm(table_name = "sessions")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub title: Option<String>,
    pub description: Option<String>,
    pub project_id: i32,
    pub task_id: Option<i32>,
    pub date: NaiveDate,
    pub start_time: i64,
    pub end_time: Option<i64>,
    pub session_duration_sec: i32,
    pub break_duration_sec: i32,
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
    #[sea_orm(
        belongs_to = "super::tasks::Entity",
        from = "Column::TaskId",
        to = "super::tasks::Column::Id",
        on_update = "Cascade",
        on_delete = "Cascade"
    )]
    Tasks,
    #[sea_orm(has_many = "super::sessions_tags::Entity")]
    SessionsTags,
}

impl Related<super::projects::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Projects.def()
    }
}

impl Related<super::tasks::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Tasks.def()
    }
}

impl Related<super::sessions_tags::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::SessionsTags.def()
    }
}

impl Related<super::tags::Entity> for Entity {
    fn to() -> RelationDef {
        super::sessions_tags::Relation::Tags.def()
    }
    fn via() -> Option<RelationDef> {
        Some(super::sessions_tags::Relation::Sessions.def().rev())
    }
}

impl ActiveModelBehavior for ActiveModel {}
