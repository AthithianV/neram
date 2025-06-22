use sea_orm_migration::prelude::*;
use sea_query::Expr;
use sea_orm::Statement;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[derive(DeriveIden)]
enum PomodoroSettings {
    Table,
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
                .table(PomodoroSettings::Table)
                .if_not_exists()
                .col(ColumnDef::new(PomodoroSettings::SessionDuration).integer().null())
                .col(ColumnDef::new(PomodoroSettings::SessionCount).integer().null())
                .col(ColumnDef::new(PomodoroSettings::BreakDuration).integer().null())
                .col(ColumnDef::new(PomodoroSettings::AutoStart).boolean().null())
                .col(ColumnDef::new(PomodoroSettings::SyncWithTimeTracking).boolean().null())
                .to_owned()
        ).await?;

        // Insert default pomodoro settings
        manager
            .get_connection()
            .execute(
                Statement::from_string(
                    manager.get_database_backend(),
                    "INSERT INTO pomodoro_settings (session_duration, session_count, break_duration, auto_start, sync_with_time_tracking) VALUES (1500, 3, 300, true, true)"
                )
            ).await?;

        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager.drop_table(Table::drop().table(PomodoroSettings::Table).to_owned()).await
    }
}
