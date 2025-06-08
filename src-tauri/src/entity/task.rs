use sea_orm::{entity::prelude::*, ActiveValue::Set};
use serde::{ Deserialize, Serialize };

#[derive(Debug, Clone, EnumIter, DeriveActiveEnum, PartialEq, Eq, Serialize, Deserialize)]
#[sea_orm(rs_type = "String", db_type = "Text")]
pub enum TodosStatus {
    #[sea_orm(string_value = "Not Started")]
    NotStarted,
    #[sea_orm(string_value = "Planning")]
    Planning,
    #[sea_orm(string_value = "In Progress")]
    InProgress,
    #[sea_orm(string_value = "Completed")]
    Completed,
}

#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Serialize, Deserialize)]
#[sea_orm(table_name = "tasks")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub title: String,
    pub description: Option<String>,
    pub color: String,
    pub status: TodosStatus,
    pub deadline: DateTimeWithTimeZone,
    pub priority: i32,
    pub created_at: DateTimeWithTimeZone,
    pub updated_at: DateTimeWithTimeZone,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation, Serialize, Deserialize)]
pub enum Relation {
    #[sea_orm(has_many = "super::workunit::Entity")]
    Workunit,
}

impl Related<super::workunit::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Workunit.def()
    }
}

impl ActiveModelBehavior for ActiveModel {}

impl Model {
    /// Converts a Model to ActiveModel for database operations
    pub fn to_active_model(self) -> ActiveModel {
        ActiveModel {
            title: Set(self.title),
            description: Set(self.description),
            status: Set(self.status),
            deadline: Set(self.deadline),
            color: Set(self.color),
            priority: Set(self.priority),
            created_at: Set(self.created_at),
            updated_at: Set(self.updated_at),
        }
    }
}
