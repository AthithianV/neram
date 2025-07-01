use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[derive(DeriveIden)]
enum Tasks {
    Table,
    Id,
    Title,
    Description,
    Color,
    ProjectId,
    Status,
    Priority,
    Deadline,
    StartedAt,
    CompletedAt,
    EstimatedTime,
    CreatedAt,
    UpdatedAt,
}

#[derive(DeriveIden)]
enum Projects {
    Table,
    Id,
}

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager.create_table(
            Table::create()
                .table(Tasks::Table)
                .if_not_exists()
                .col(ColumnDef::new(Tasks::Id).integer().not_null().auto_increment().primary_key())
                .col(ColumnDef::new(Tasks::Title).string().not_null())
                .col(ColumnDef::new(Tasks::Description).string().null())
                .col(ColumnDef::new(Tasks::Color).string().null())
                .col(ColumnDef::new(Tasks::ProjectId).integer().not_null())
                .col(ColumnDef::new(Tasks::Status).string().not_null().default("Planning"))
                .col(ColumnDef::new(Tasks::Priority).string().not_null().default("Low"))
                .col(ColumnDef::new(Tasks::Deadline).string().null())
                .col(ColumnDef::new(Tasks::StartedAt).string().not_null())
                .col(ColumnDef::new(Tasks::CompletedAt).string().null())
                .col(ColumnDef::new(Tasks::EstimatedTime).integer().null())
                .col(
                    ColumnDef::new(Tasks::CreatedAt)
                        .string()
                        .not_null()
                        .default(Expr::cust("CURRENT_TIMESTAMP"))
                )
                .col(
                    ColumnDef::new(Tasks::UpdatedAt)
                        .string()
                        .not_null()
                        .default(Expr::cust("CURRENT_TIMESTAMP"))
                )
                .foreign_key(
                    ForeignKey::create()
                        .name("fk_tasks_project_id")
                        .from(Tasks::Table, Tasks::ProjectId)
                        .to(Projects::Table, Projects::Id)
                        .on_delete(ForeignKeyAction::Cascade)
                        .on_update(ForeignKeyAction::Cascade)
                )
                .to_owned()
        ).await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager.drop_table(Table::drop().table(Tasks::Table).to_owned()).await
    }
}
