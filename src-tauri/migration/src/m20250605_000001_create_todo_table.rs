use sea_orm_migration::prelude::*;
use sea_query::Expr;
use sea_orm::{EnumIter, Iterable};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[derive(DeriveIden)]
enum Todos {
    Table,
    Id,
    Title,
    Description,
    Color,
    Status,
    Deadline,    
    CreatedAt,
    UpdatedAt,
}


#[derive(Iden)]
pub enum TodosTypeEnum {
    #[iden = "todos_status"]
    Enum,
}

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {

         // Create enum type
        manager
            .create_type(
                Type::create()
                    .as_enum(TodosTypeEnum::Enum)
                    .values(["Not Started", "Planning", "In Progress", "Completed"])
                    .to_owned(),
            )
            .await?;

        manager.create_table(
            Table::create()
                .table(Todos::Table)
                .if_not_exists()
                .col(ColumnDef::new(Todos::Id).integer().not_null().auto_increment().primary_key())
                .col(ColumnDef::new(Todos::Title).string().not_null())
                .col(ColumnDef::new(Todos::Description).string().null())
                .col(ColumnDef::new(Todos::Color).string().null())
                .col(ColumnDef::new(Todos::Status).enumerate(TodosTypeEnum::Enum).not_null())
                .col(ColumnDef::new(Todos::Deadline).date_time().not_null())
                .col(ColumnDef::new(Todos::CreatedAt).date_time().not_null().default(Expr::current_timestamp()))
                .col(ColumnDef::new(Todos::UpdatedAt).date_time().not_null().default(Expr::current_timestamp()))
                .to_owned(),
        )
        .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager.drop_table(
            Table::drop()
                .table(Todos::Table)
                .to_owned(),
        )
        .await
    }
}
