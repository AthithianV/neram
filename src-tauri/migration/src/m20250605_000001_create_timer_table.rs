use sea_orm_migration::prelude::*;
use sea_query::{extension::postgres::Type, Expr};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[derive(DeriveIden)]
enum Timer {
    Table,
    Id,
    IsRunning,
    Type,
    Duration,
    CreatedAt,
    UpdatedAt,
}

#[derive(Iden)]
pub enum TimerTypeEnum {
    #[iden = "timer_type"]
    Enum,
}

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        // Create enum type
        manager
            .create_type(
                Type::create()
                    .as_enum(TimerTypeEnum::Enum)
                    .values(["SESSION", "BREAK", "POMODARO"])
                    .to_owned(),
            )
            .await?;

        // Create table
        manager
            .create_table(
                Table::create()
                    .table(Timer::Table)
                    .if_not_exists()
                    .col(ColumnDef::new(Timer::Id).integer().not_null().auto_increment().primary_key())
                    .col(ColumnDef::new(Timer::IsRunning).boolean().not_null())
                    .col(ColumnDef::new(Timer::Type).enumeration(TimerTypeEnum::Enum).not_null())
                    .col(ColumnDef::new(Timer::Duration).double().not_null())
                    .col(ColumnDef::new(Timer::CreatedAt).date_time().not_null().default(Expr::current_timestamp()))
                    .col(ColumnDef::new(Timer::UpdatedAt).date_time().not_null().default(Expr::current_timestamp()))
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Timer::Table).to_owned())
            .await?;

        manager
            .drop_type(Type::drop().name(TimerTypeEnum::Enum).to_owned())
            .await
    }
}
