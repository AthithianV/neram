use sea_orm_migration::prelude::*;
use sea_query::Expr;
use sea_orm::Statement;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[derive(DeriveIden)]
enum Settings {
    Table,
    Theme,
    DateFormat,
    TimeFormat,
}

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager.create_table(
            Table::create()
                .table(Settings::Table)
                .if_not_exists()
                .col(ColumnDef::new(Settings::Theme).string().null())
                .col(ColumnDef::new(Settings::DateFormat).string().null())
                .col(ColumnDef::new(Settings::TimeFormat).string().null())
                .to_owned()
        ).await?;

        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager.drop_table(Table::drop().table(Settings::Table).to_owned()).await
    }
}
