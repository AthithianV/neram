use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[derive(Iden)]
enum Tasks {
    Table,
    Id,
    Title,
    Description,
    Color,
    IsDefault,
    CreatedAt,
    UpdatedAt,
    DeletedAt,
}

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager.create_table(
            Table::create()
                .table(Tasks::Table)
                .if_not_exists()
                .col(ColumnDef::new(Tasks::Id).integer().not_null().auto_increment().primary_key())
                .col(ColumnDef::new(Tasks::Title).string().not_null())
                .col(ColumnDef::new(Tasks::Description).string().null())
                .col(ColumnDef::new(Tasks::Color).string().null())
                .col(ColumnDef::new(Tasks::IsDefault).boolean().not_null().default(false))
                .col(ColumnDef::new(Tasks::CreatedAt).date_time().not_null())
                .col(ColumnDef::new(Tasks::UpdatedAt).date_time().not_null())
                .col(ColumnDef::new(Tasks::DeletedAt).date_time().null())
                .to_owned(),
        )
        .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager.drop_table(
            Table::drop()
                .table(Tasks::Table)
                .to_owned(),
        )
        .await
    }
}
