use sea_orm::entity::prelude::*;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "tasks")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,

    pub title: String,
    pub description: Option<String>,
    pub color: Option<String>,
    pub is_default: bool,

    pub created_at: DateTimeWithTimeZone,
    pub updated_at: DateTimeWithTimeZone,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
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
