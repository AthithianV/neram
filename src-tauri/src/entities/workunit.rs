use sea_orm::entity::prelude::*;
use sea_orm::ActiveValue::Set;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "workunits")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,

    pub title: Option<String>,
    pub description: Option<String>,

    pub task_id: i32,
    pub date: DateTimeWithTimeZone,

    pub start_time: DateTimeWithTimeZone,
    pub end_time: DateTimeWithTimeZone,

    pub duration: i32,
    #[sea_orm(column_name = "break")]
    pub break_time: i32,

    pub created_at: DateTimeWithTimeZone,
    pub updated_at: DateTimeWithTimeZone,
    pub deleted_at: Option<DateTimeWithTimeZone>,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(
        belongs_to = "super::task::Entity",
        from = "Column::TaskId",
        to = "super::task::Column::Id"
    )]
    Task,
}

impl Related<super::task::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Task.def()
    }
}

impl ActiveModelBehavior for ActiveModel {}
