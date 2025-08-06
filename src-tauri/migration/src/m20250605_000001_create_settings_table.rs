use sea_orm::Statement;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[derive(DeriveIden)]
enum Settings {
    Table,
    Id,
    Theme,
    DateFormat,
    TimeFormat,
}

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Settings::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(Settings::Id)
                            .integer()
                            .not_null()
                            .auto_increment()
                            .primary_key(),
                    )
                    .col(ColumnDef::new(Settings::Theme).string().null())
                    .col(ColumnDef::new(Settings::DateFormat).string().null())
                    .col(ColumnDef::new(Settings::TimeFormat).string().null())
                    .to_owned(),
            )
            .await?;

        manager
            .get_connection()
            .execute(
                Statement::from_string(
                    manager.get_database_backend(),
                    format!("INSERT INTO settings (theme, date_format, time_format) VALUES ('Light', 'DD/MM/YYYY', 'hh:mm:ss A');"),
                )
            ).await?;

        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Settings::Table).to_owned())
            .await
    }
}
