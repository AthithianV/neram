use sea_orm::Statement;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[derive(DeriveIden)]
enum PomodoroSettings {
    Table,
    Id,
    SessionDuration,
    SessionCount,
    BreakDuration,
    AutoStart,
    NotificationSound,
    SyncWithTimeTracking,
    SessionCompleted,
    BreakCompleted,
    DefaultProject,
}

#[derive(DeriveIden)]
enum Projects {
    Table,
    Id,
}

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(PomodoroSettings::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(PomodoroSettings::Id)
                            .integer()
                            .not_null()
                            .auto_increment()
                            .primary_key(),
                    )
                    .col(
                        ColumnDef::new(PomodoroSettings::SessionDuration)
                            .integer()
                            .not_null()
                            .default(1500),
                    )
                    .col(
                        ColumnDef::new(PomodoroSettings::SessionCount)
                            .integer()
                            .not_null()
                            .default(4),
                    )
                    .col(
                        ColumnDef::new(PomodoroSettings::BreakDuration)
                            .integer()
                            .not_null()
                            .default(300),
                    )
                    .col(
                        ColumnDef::new(PomodoroSettings::AutoStart)
                            .boolean()
                            .not_null()
                            .default(true),
                    )
                    .col(
                        ColumnDef::new(PomodoroSettings::SyncWithTimeTracking)
                            .boolean()
                            .not_null()
                            .default(false),
                    )
                    .col(
                        ColumnDef::new(PomodoroSettings::NotificationSound)
                            .boolean()
                            .not_null()
                            .default(false),
                    )
                    .col(
                        ColumnDef::new(PomodoroSettings::SessionCompleted)
                            .integer()
                            .not_null()
                            .default(0),
                    )
                    .col(
                        ColumnDef::new(PomodoroSettings::BreakCompleted)
                            .integer()
                            .not_null()
                            .default(0),
                    )
                    .col(
                        ColumnDef::new(PomodoroSettings::DefaultProject)
                            .integer()
                            .null(),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk_pomodoro_settings_project")
                            .from(PomodoroSettings::Table, PomodoroSettings::DefaultProject)
                            .to(Projects::Table, Projects::Id)
                            .on_delete(ForeignKeyAction::Cascade)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await?;

        // Insert default pomodoro settings
        manager
            .get_connection()
            .execute(Statement::from_string(
                manager.get_database_backend(),
                "INSERT INTO pomodoro_settings DEFAULT VALUES;",
            ))
            .await?;

        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(PomodoroSettings::Table).to_owned())
            .await
    }
}
