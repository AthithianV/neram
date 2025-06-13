use sea_orm_migration::prelude::*;
use sea_query::Expr;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[derive(DeriveIden)]
enum Tasks {
    Table,
    Title,
    Description,
    Color,
    Status,
    Deadline,
    Priority,
    CreatedAt,
    UpdatedAt,
}

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager.create_table(
            Table::create()
                .table(Tasks::Table)
                .if_not_exists()
                .col(ColumnDef::new(Tasks::Title).string().not_null().primary_key())
                .col(ColumnDef::new(Tasks::Description).string().null())
                .col(ColumnDef::new(Tasks::Color).string().not_null().default("#F3F4F6"))
                .col(ColumnDef::new(Tasks::Status).string().not_null().default("Not Started"))
                .col(ColumnDef::new(Tasks::Deadline).date_time().not_null())
                .col(ColumnDef::new(Tasks::Priority).integer().not_null().default(1))
                .col(
                    ColumnDef::new(Tasks::CreatedAt)
                        .date_time()
                        .not_null()
                        .default(Expr::current_timestamp())
                )
                .col(
                    ColumnDef::new(Tasks::UpdatedAt)
                        .date_time()
                        .not_null()
                        .default(Expr::current_timestamp())
                )
                .to_owned()

        ).await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager.drop_table(Table::drop().table(Tasks::Table).to_owned()).await
    }
}
