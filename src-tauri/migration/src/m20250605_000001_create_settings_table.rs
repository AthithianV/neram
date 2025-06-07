use sea_orm_migration::prelude::*;
use sea_query::{Expr, Query, SqliteQueryBuilder};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[derive(DeriveIden)]
enum Settings {
    Table,
    Id,
    Theme,
    CreatedAt,
    UpdatedAt,
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
                            .primary_key(),
                    )
                    .col(ColumnDef::new(Settings::Theme).string().not_null())
                    .col(
                        ColumnDef::new(Settings::CreatedAt)
                            .date_time()
                            .not_null()
                            .default(Expr::current_timestamp()),
                    )
                    .col(
                        ColumnDef::new(Settings::UpdatedAt)
                            .date_time()
                            .not_null()
                            .default(Expr::current_timestamp()),
                    )
                    .to_owned(),
            )
            .await?;

        let insert_query = Query::insert()
            .into_table(Settings::Table)
            .columns([Settings::Id, Settings::Theme])
            .values_panic([(1).into(), "light".into()])
            .to_owned();

        let (sql_string, _params) = insert_query.build(SqliteQueryBuilder);
        println!("SQL to be executed: {}", sql_string);

        let db = manager.get_connection();

        db.execute_unprepared(sql_string.as_str()).await?;

        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Settings::Table).to_owned())
            .await
    }
}
