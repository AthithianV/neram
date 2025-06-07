use sea_orm::entity::prelude::*;
use serde::{ Deserialize, Serialize };

#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Serialize, Deserialize)]
#[sea_orm(table_name = "tasks")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub title: String,
    pub description: Option<String>,
    pub color: Option<String>,
    pub is_default: bool,

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
