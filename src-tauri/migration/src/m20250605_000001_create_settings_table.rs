use sea_orm_migration::prelude::*;
use sea_query::Expr;
use sea_orm::Statement;

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
        manager.create_table(
            Table::create()
                .table(Settings::Table)
                .if_not_exists()
                .col(ColumnDef::new(Settings::Id).integer().not_null().primary_key())
                .col(ColumnDef::new(Settings::Theme).string().not_null().default("SYSTEM"))
                .col(
                    ColumnDef::new(Settings::CreatedAt)
                        .date_time()
                        .not_null()
                        .default(Expr::current_timestamp())
                )
                .col(
                    ColumnDef::new(Settings::UpdatedAt)
                        .date_time()
                        .not_null()
                        .default(Expr::current_timestamp())
                )
                .to_owned()
        ).await?;

        let db = manager.get_connection();
        let stmt = Statement::from_sql_and_values(
            manager.get_database_backend(),
            r#"INSERT INTO `settings` (`id`, `theme`) VALUES (?, ?)"#,
            [(1).into(), "light".into()]
        );
        db.execute(stmt).await?;

        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager.drop_table(Table::drop().table(Settings::Table).to_owned()).await
    }
}
