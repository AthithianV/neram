use sea_orm::entity::prelude::*;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "workunits_tags")]
pub struct Model {
    #[sea_orm(primary_key, auto_increment = false)]
    pub workunit_id: i32,

    #[sea_orm(primary_key, auto_increment = false)]
    pub tag: String,

    pub created_at: DateTimeWithTimeZone,
    pub updated_at: DateTimeWithTimeZone,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(
        belongs_to = "super::workunit::Entity",
        from = "Column::WorkunitId",
        to = "super::workunit::Column::Id"
    )]
    Workunit,

    #[sea_orm(
        belongs_to = "super::tag::Entity",
        from = "Column::Tag",
        to = "super::tag::Column::Title"
    )]
    Tag,
}

impl Related<super::workunit::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Workunit.def()
    }
}
impl Related<super::tag::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Tag.def()
    }
}

impl ActiveModelBehavior for ActiveModel {}
