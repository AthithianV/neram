use sea_orm_migration::prelude::*;
use sea_query::Expr;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Workunits::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(Workunits::Id)
                            .integer()
                            .not_null()
                            .auto_increment()
                            .primary_key(),
                    )
                    .col(ColumnDef::new(Workunits::Title).string().null())
                    .col(ColumnDef::new(Workunits::Description).string().null())
                    .col(ColumnDef::new(Workunits::TaskId).integer().not_null())
                    .col(ColumnDef::new(Workunits::Date).date_time().not_null())
                    .col(ColumnDef::new(Workunits::StartTime).date_time().not_null())
                    .col(ColumnDef::new(Workunits::EndTime).date_time().not_null())
                    .col(ColumnDef::new(Workunits::Duration).integer().not_null())
                    .col(ColumnDef::new(Workunits::BreakTime).integer().not_null())
                    .col(
                        ColumnDef::new(Workunits::CreatedAt)
                            .date_time()
                            .not_null()
                            .default(Expr::current_timestamp()),
                    )
                    .col(
                        ColumnDef::new(Workunits::UpdatedAt)
                            .date_time()
                            .not_null()
                            .default(Expr::current_timestamp()),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk-workunits-task_id")
                            .from(Workunits::Table, Workunits::TaskId)
                            .to(Tasks::Table, Tasks::Id)
                            .on_delete(ForeignKeyAction::Cascade)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Workunits::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum Workunits {
    Table,
    Id,
    Title,
    Description,
    TaskId,
    Date,
    StartTime,
    EndTime,
    Duration,
    BreakTime,
    CreatedAt,
    UpdatedAt,
}

#[derive(DeriveIden)]
enum Tasks {
    Table,
    Id,
}
