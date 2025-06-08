use sea_orm_migration::prelude::*;
use sea_query::Expr;
use sea_orm::Statement;

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
}

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager.create_table(
            Table::create()
                .table(Pomodaro::Table)
                .if_not_exists()
                .col(ColumnDef::new(Pomodaro::Id).integer().not_null().primary_key())
                .col(ColumnDef::new(Pomodaro::Duration).double().not_null())
                .col(ColumnDef::new(Pomodaro::SessionDuration).double().not_null())
                .col(ColumnDef::new(Pomodaro::SessionCount).integer().not_null())
                .col(ColumnDef::new(Pomodaro::BreakDuration).double().not_null())
                .col(ColumnDef::new(Pomodaro::AutoStart).boolean().not_null())
                .col(ColumnDef::new(Pomodaro::SyncWithTimeTracking).boolean().not_null())
                .to_owned()
        ).await?;

        let db = manager.get_connection();
        let stmt = Statement::from_sql_and_values(
            manager.get_database_backend(),
            r#"INSERT INTO `pomodaro` (`id`, `duration`, `session_duration`, `session_count`, `break_duration`, `auto_start`, `sync_with_time_tracking`) VALUES (?, ?, ?, ?, ?, ?, ?)"#,
            [
                (1).into(),
                (25.0).into(),
                (25.0).into(),
                (4).into(),
                (5.0).into(),
                true.into(),
                false.into(),
            ]
        );
        db.execute(stmt).await?;

        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager.drop_table(Table::drop().table(Pomodaro::Table).to_owned()).await
    }
}
