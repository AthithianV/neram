use chrono::NaiveDateTime;
use sea_orm::entity::prelude::*;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Eq)]
#[sea_orm(table_name = "tasks")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub title: String,
    pub description: Option<String>,
    pub project_id: i32,
    pub status: String,
    pub priority: Option<String>,
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

impl ActiveModelBehavior for ActiveModel {}
