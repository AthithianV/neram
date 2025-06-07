use sea_orm::entity::prelude::*;
use serde::{ Deserialize, Serialize };

#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Serialize, Deserialize)]
#[sea_orm(table_name = "workunits")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,

    pub title: Option<String>,
    pub description: Option<String>,

    pub task: String,
    pub date: DateTimeWithTimeZone,

    pub start_time: DateTimeWithTimeZone,
    pub end_time: DateTimeWithTimeZone,

    pub session_duration: i32,
    pub break_duration: i32,

    pub created_at: DateTimeWithTimeZone,
    pub updated_at: DateTimeWithTimeZone,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation, Serialize, Deserialize)]
pub enum Relation {
    #[sea_orm(
        belongs_to = "super::task::Entity",
        from = "Column::Task",
        to = "super::task::Column::Title"
    )]
    Task,
}

impl Related<super::task::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Task.def()
    }
}

impl ActiveModelBehavior for ActiveModel {}
