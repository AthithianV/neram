use sea_orm::entity::prelude::*;

#[derive(Debug, Clone, EnumIter, DeriveActiveEnum, PartialEq, Eq)]
#[sea_orm(rs_type = "String", db_type = "Text")]
pub enum Theme {
    #[sea_orm(string_value = "DARK")]
    Dark,
    #[sea_orm(string_value = "LIGHT")]
    Light,
    #[sea_orm(string_value = "SYSTEM")]
    System,
}

// settings
#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "settings")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub theme: Theme,
    pub created_at: DateTimeWithTimeZone,
    pub updated_at: DateTimeWithTimeZone,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {}
impl ActiveModelBehavior for ActiveModel {}