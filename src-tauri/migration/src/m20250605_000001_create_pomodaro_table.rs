use sea_orm_migration::prelude::*;
use sea_query::Expr;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[derive(DeriveIden)]
enum Pomodaro {
    Table,
    Id,
    Duration,
    SessionDuration,
    SessionCount,
    BreakDuration,
    AutoStart,
    SyncWithTimeTracking,
    CreatedAt,
    UpdatedAt,
}

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Pomodaro::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(Pomodaro::Id)
                            .integer()
                            .not_null()
                            .auto_increment()
                            .primary_key(),
                    )
                    .col(ColumnDef::new(Pomodaro::Duration).double().not_null())
                    .col(ColumnDef::new(Pomodaro::SessionDuration).double().not_null())
                    .col(ColumnDef::new(Pomodaro::SessionCount).integer().not_null())
                    .col(ColumnDef::new(Pomodaro::BreakDuration).double().not_null())
                    .col(ColumnDef::new(Pomodaro::AutoStart).boolean().not_null())
                    .col(ColumnDef::new(Pomodaro::SyncWithTimeTracking).boolean().not_null())
                    .col(
                        ColumnDef::new(Pomodaro::CreatedAt)
                            .date_time()
                            .not_null()
                            .default(Expr::current_timestamp()),
                    )
                    .col(
                        ColumnDef::new(Pomodaro::UpdatedAt)
                            .date_time()
                            .not_null()
                            .default(Expr::current_timestamp()),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Pomodaro::Table).to_owned())
            .await
    }
}
