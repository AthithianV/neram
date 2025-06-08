use sea_orm::{ entity::prelude::*, ActiveValue::Set };
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

    pub created_at: Option<DateTimeWithTimeZone>,
    pub updated_at: Option<DateTimeWithTimeZone>,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation, Serialize, Deserialize)]
pub enum Relation {
    #[sea_orm(
        belongs_to = "super::task::Entity",
        from = "Column::Task",
        to = "super::task::Column::Title"
    )]
    Task,

    #[sea_orm(has_many = "super::workunit_tag::Entity")]
    WorkunitTags,
}

impl Related<super::task::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Task.def()
    }
}

// Many-to-many relation through workunits_tags
impl Related<super::tag::Entity> for Entity {
    fn to() -> RelationDef {
        super::workunit_tag::Relation::Tag.def()
    }

    fn via() -> Option<RelationDef> {
        Some(super::workunit_tag::Relation::Workunit.def().rev())
    }
}

impl ActiveModelBehavior for ActiveModel {}

impl Model {
    /// Converts a Model to ActiveModel for database operations
    pub fn to_active_model(self) -> ActiveModel {
        ActiveModel {
            id: Set(self.id),
            title: Set(self.title),
            description: Set(self.description),
            task: Set(self.task),
            date: Set(self.date),
            start_time: Set(self.start_time),
            end_time: Set(self.end_time),
            session_duration: Set(self.session_duration),
            break_duration: Set(self.break_duration),
            created_at: Set(self.created_at),
            updated_at: Set(self.updated_at),
        }
    }
}
