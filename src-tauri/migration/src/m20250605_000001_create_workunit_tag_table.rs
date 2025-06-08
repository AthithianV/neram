use sea_orm_migration::prelude::*;
use sea_query::Expr;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager.create_table(
            Table::create()
                .table(WorkunitTag::Table)
                .if_not_exists()
                .col(ColumnDef::new(WorkunitTag::WorkunitId).integer().not_null())
                .col(ColumnDef::new(WorkunitTag::Tag).string().not_null())
                .primary_key(
                    Index::create()
                        .name("pk-workunit_tag")
                        .col(WorkunitTag::WorkunitId)
                        .col(WorkunitTag::Tag)
                )
                .foreign_key(
                    ForeignKey::create()
                        .name("fk-workunits-tag-relation_id1")
                        .from(WorkunitTag::Table, WorkunitTag::Tag)
                        .to(Tags::Table, Tags::Title)
                        .on_delete(ForeignKeyAction::Cascade)
                        .on_update(ForeignKeyAction::Cascade)
                )
                .foreign_key(
                    ForeignKey::create()
                        .name("fk-workunits-tag-relation_id2")
                        .from(WorkunitTag::Table, WorkunitTag::WorkunitId)
                        .to(Workunits::Table, Workunits::Id)
                        .on_delete(ForeignKeyAction::Cascade)
                        .on_update(ForeignKeyAction::Cascade)
                )
                .to_owned()
        ).await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager.drop_table(Table::drop().table(WorkunitTag::Table).to_owned()).await
    }
}

#[derive(DeriveIden)]
enum Workunits {
    Table,
    Id,
}

#[derive(DeriveIden)]
enum Tags {
    Table,
    Title,
}

#[derive(DeriveIden)]
enum WorkunitTag {
    Table,
    WorkunitId,
    Tag,
}
