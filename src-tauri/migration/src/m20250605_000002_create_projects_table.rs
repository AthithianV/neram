use sea_orm::Statement;
use sea_orm_migration::prelude::*;

use crate::now;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[derive(DeriveIden)]
enum Projects {
    Table,
    Id,
    Title,
    Description,
    Color,
    ClientName,
    StartedAt,
    Deadline,
    CompletedAt,
    IsBillable,
    BillingType,
    HourlyRate,
    FixedRate,
    Currency,
    CreatedAt,
    UpdatedAt,
}

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Projects::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(Projects::Id)
                            .integer()
                            .not_null()
                            .auto_increment()
                            .primary_key(),
                    )
                    .col(ColumnDef::new(Projects::Title).string().not_null())
                    .col(ColumnDef::new(Projects::Description).string().null())
                    .col(ColumnDef::new(Projects::Color).string().null())
                    .col(ColumnDef::new(Projects::ClientName).string().null())
                    .col(ColumnDef::new(Projects::StartedAt).string().null())
                    .col(ColumnDef::new(Projects::Deadline).string().null())
                    .col(ColumnDef::new(Projects::CompletedAt).string().null())
                    .col(ColumnDef::new(Projects::IsBillable).boolean().null())
                    .col(ColumnDef::new(Projects::BillingType).string().null())
                    .col(ColumnDef::new(Projects::HourlyRate).integer().null())
                    .col(ColumnDef::new(Projects::FixedRate).integer().null())
                    .col(ColumnDef::new(Projects::Currency).string().null())
                    .col(
                        ColumnDef::new(Projects::CreatedAt)
                            .string()
                            .not_null()
                            .default(Expr::cust("CURRENT_TIMESTAMP")),
                    )
                    .col(
                        ColumnDef::new(Projects::UpdatedAt)
                            .string()
                            .not_null()
                            .default(Expr::cust("CURRENT_TIMESTAMP")),
                    )
                    .to_owned(),
            )
            .await?;

        let now = now().to_string();
        // Insert default "General" project
        manager
            .get_connection()
            .execute(
                Statement::from_string(
                    manager.get_database_backend(),
                    format!("INSERT INTO projects (title, description, color, created_at, updated_at) VALUES ('Neram', 'Demo Project', '#222222', {}, {})", now, now)
                )
            ).await?;

        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Projects::Table).to_owned())
            .await
    }
}
