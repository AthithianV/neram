use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        let conn = manager.get_connection();

        // ---- 1️⃣ Add notification_sound if it doesn't exist
        let stmt = sea_orm::Statement::from_string(
            manager.get_database_backend(),
            "ALTER TABLE pomodoro_settings ADD COLUMN notification_sound BOOLEAN NOT NULL DEFAULT false;"
                .to_string(),
        );
        // Try executing and ignore "duplicate column" error
        let _ = conn.execute(stmt).await;

        // ---- 2️⃣ Add default_project if it doesn't exist
        let stmt = sea_orm::Statement::from_string(
            manager.get_database_backend(),
            "ALTER TABLE pomodoro_settings ADD COLUMN default_project INTEGER NULL;".to_string(),
        );
        let _ = conn.execute(stmt).await;

        Ok(())
    }

    async fn down(&self, _manager: &SchemaManager) -> Result<(), DbErr> {
        // SQLite cannot drop columns easily, leave as no-op
        Ok(())
    }
}
