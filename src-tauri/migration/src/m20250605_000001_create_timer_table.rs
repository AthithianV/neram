use sea_orm_migration::prelude::*;
use sea_query::{Expr, Query, SqliteQueryBuilder};

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

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        // Create table
        manager
            .create_table(
                Table::create()
                    .table(Timer::Table)
                    .if_not_exists()
                    .col(ColumnDef::new(Timer::Id).integer().not_null().primary_key())
                    .col(ColumnDef::new(Timer::IsRunning).boolean().not_null())
                    .col(ColumnDef::new(Timer::Type).string().not_null())
                    .col(ColumnDef::new(Timer::Duration).double().not_null())
                    .col(
                        ColumnDef::new(Timer::CreatedAt)
                            .date_time()
                            .not_null()
                            .default(Expr::current_timestamp()),
                    )
                    .col(
                        ColumnDef::new(Timer::UpdatedAt)
                            .date_time()
                            .not_null()
                            .default(Expr::current_timestamp()),
                    )
                    .to_owned(),
            )
            .await?;

        let insert_query = Query::insert()
            .into_table(Timer::Table)
            .columns([Timer::Id, Timer::IsRunning, Timer::Type, Timer::Duration])
            .values_panic([(1).into(), false.into(), "SESSION".into(), (0).into()])
            .to_owned();
        let (sql_string, _params) = insert_query.build(SqliteQueryBuilder);
        println!("SQL to be executed: {}", sql_string);

        let db = manager.get_connection();

        db.execute_unprepared(sql_string.as_str()).await?;

        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Timer::Table).to_owned())
            .await
    }
}
