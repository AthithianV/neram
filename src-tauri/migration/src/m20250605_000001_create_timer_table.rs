use sea_orm_migration::prelude::*;
use sea_orm::Statement;
use sea_query::Expr;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[derive(DeriveIden)]
enum Timer {
    Table,
    Id,
    IsRunning,
    Type,
    Duration,
}

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        // Create table
        manager.create_table(
            Table::create()
                .table(Timer::Table)
                .if_not_exists()
                .col(ColumnDef::new(Timer::Id).integer().not_null().primary_key())
                .col(ColumnDef::new(Timer::IsRunning).boolean().not_null())
                .col(ColumnDef::new(Timer::Type).string().not_null())
                .col(ColumnDef::new(Timer::Duration).double().not_null())
                .to_owned()
        ).await?;

        let db = manager.get_connection();
        let stmt = Statement::from_sql_and_values(
            manager.get_database_backend(),
            r#"INSERT INTO `timer` (`id`, `is_running`, `type`, `duration`) VALUES (?, ?, ?, ?)"#,
            [(1).into(), false.into(), "SESSION".into(), (0).into()]
        );
        db.execute(stmt).await?;

        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager.drop_table(Table::drop().table(Timer::Table).to_owned()).await
    }
}
