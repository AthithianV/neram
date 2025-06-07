use sea_orm::entity::prelude::*;
use serde::{ Deserialize, Serialize };

#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Serialize, Deserialize)]
#[sea_orm(table_name = "tags")]
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
    #[sea_orm(has_many = "super::workunit_tag::Entity")]
    WorkunitTags,
}

// Many-to-many relation through workunits_tags
impl Related<super::workunit::Entity> for Entity {
    fn to() -> RelationDef {
        super::workunit_tag::Relation::Workunit.def()
    }

    fn via() -> Option<RelationDef> {
        Some(super::workunit_tag::Relation::Tag.def().rev())
    }
}

impl ActiveModelBehavior for ActiveModel {}
