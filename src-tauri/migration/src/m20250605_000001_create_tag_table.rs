use sea_orm_migration::prelude::*;
use sea_query::Expr;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[derive(DeriveIden)]
enum Tags {
    Table,
    Id,
    Title,
    Description,
    Color,
    CreatedAt,
    UpdatedAt,
}

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager.create_table(
            Table::create()
                .table(Tags::Table)
                .if_not_exists()
                .col(ColumnDef::new(Tags::Id).integer().not_null().auto_increment().primary_key())
                .col(ColumnDef::new(Tags::Title).string().not_null())
                .col(ColumnDef::new(Tags::Description).string().null())
                .col(ColumnDef::new(Tags::Color).string().null())
                .col(
                    ColumnDef::new(Tags::CreatedAt).string().not_null().default("CURRENT_TIMESTAMP")
                )
                .col(
                    ColumnDef::new(Tags::UpdatedAt).string().not_null().default("CURRENT_TIMESTAMP")
                )
                .to_owned()
        ).await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager.drop_table(Table::drop().table(Tags::Table).to_owned()).await
    }
}
