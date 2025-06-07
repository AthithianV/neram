use sea_orm::entity::prelude::*;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
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

    pub duration: i32,
    #[sea_orm(column_name = "break")]
    pub break_time: i32,

    pub created_at: DateTimeWithTimeZone,
    pub updated_at: DateTimeWithTimeZone,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
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
