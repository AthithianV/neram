use sea_orm_migration::prelude::*;
use sea_query::{ Expr, Query, SqliteQueryBuilder };

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
                .col(
                    ColumnDef::new(Pomodaro::CreatedAt)
                        .date_time()
                        .not_null()
                        .default(Expr::current_timestamp())
                )
                .col(
                    ColumnDef::new(Pomodaro::UpdatedAt)
                        .date_time()
                        .not_null()
                        .default(Expr::current_timestamp())
                )
                .to_owned()
        ).await?;

        // --- Prepare the insert query ---
        let insert_query = Query::insert()
            .into_table(Pomodaro::Table)
            .columns([
                Pomodaro::Id,
                Pomodaro::Duration,
                Pomodaro::SessionDuration,
                Pomodaro::SessionCount,
                Pomodaro::BreakDuration,
                Pomodaro::AutoStart,
                Pomodaro::SyncWithTimeTracking,
            ])
            .values_panic([
                (1).into(),
                (25.0).into(),
                (25.0).into(),
                (4).into(),
                (5.0).into(),
                true.into(),
                false.into(),
            ])
            .to_owned();

        // --- Print the generated SQL for debugging ---
        let (sql_string, _params) = insert_query.build(SqliteQueryBuilder);
        println!("SQL to be executed: {}", sql_string);

        // --- Execute the query ---
        let db = manager.get_connection();
        db.execute_unprepared(sql_string.as_str()).await?;

        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager.drop_table(Table::drop().table(Pomodaro::Table).to_owned()).await
    }
}
