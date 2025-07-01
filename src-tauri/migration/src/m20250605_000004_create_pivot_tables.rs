use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[derive(DeriveIden)]
enum SessionsTags {
    Table,
    SessionId,
    TagId,
}

#[derive(DeriveIden)]
enum ProjectsTags {
    Table,
    ProjectId,
    TagId,
}

#[derive(DeriveIden)]
enum TasksTags {
    Table,
    TaskId,
    TagId,
}

#[derive(DeriveIden)]
enum Sessions {
    Table,
    Id,
}

#[derive(DeriveIden)]
enum Projects {
    Table,
    Id,
}

#[derive(DeriveIden)]
enum Tasks {
    Table,
    Id,
}

#[derive(DeriveIden)]
enum Tags {
    Table,
    Id,
}

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        // Create sessions_tags pivot table
        manager.create_table(
            Table::create()
                .table(SessionsTags::Table)
                .if_not_exists()
                .col(ColumnDef::new(SessionsTags::SessionId).integer().not_null())
                .col(ColumnDef::new(SessionsTags::TagId).integer().not_null())
                .primary_key(
                    Index::create()
                        .name("pk_sessions_tags")
                        .col(SessionsTags::SessionId)
                        .col(SessionsTags::TagId)
                )
                .foreign_key(
                    ForeignKey::create()
                        .name("fk_sessions_tags_session_id")
                        .from(SessionsTags::Table, SessionsTags::SessionId)
                        .to(Sessions::Table, Sessions::Id)
                        .on_delete(ForeignKeyAction::Cascade)
                        .on_update(ForeignKeyAction::Cascade)
                )
                .foreign_key(
                    ForeignKey::create()
                        .name("fk_sessions_tags_tag_id")
                        .from(SessionsTags::Table, SessionsTags::TagId)
                        .to(Tags::Table, Tags::Id)
                        .on_delete(ForeignKeyAction::Cascade)
                        .on_update(ForeignKeyAction::Cascade)
                )
                .to_owned()
        ).await?;

        // Create projects_tags pivot table
        manager.create_table(
            Table::create()
                .table(ProjectsTags::Table)
                .if_not_exists()
                .col(ColumnDef::new(ProjectsTags::ProjectId).integer().not_null())
                .col(ColumnDef::new(ProjectsTags::TagId).integer().not_null())
                .primary_key(
                    Index::create()
                        .name("pk_projects_tags")
                        .col(ProjectsTags::ProjectId)
                        .col(ProjectsTags::TagId)
                )
                .foreign_key(
                    ForeignKey::create()
                        .name("fk_projects_tags_project_id")
                        .from(ProjectsTags::Table, ProjectsTags::ProjectId)
                        .to(Projects::Table, Projects::Id)
                        .on_delete(ForeignKeyAction::Cascade)
                        .on_update(ForeignKeyAction::Cascade)
                )
                .foreign_key(
                    ForeignKey::create()
                        .name("fk_projects_tags_tag_id")
                        .from(ProjectsTags::Table, ProjectsTags::TagId)
                        .to(Tags::Table, Tags::Id)
                        .on_delete(ForeignKeyAction::Cascade)
                        .on_update(ForeignKeyAction::Cascade)
                )
                .to_owned()
        ).await?;

        // Create tasks_tags pivot table
        manager.create_table(
            Table::create()
                .table(TasksTags::Table)
                .if_not_exists()
                .col(ColumnDef::new(TasksTags::TaskId).integer().not_null())
                .col(ColumnDef::new(TasksTags::TagId).integer().not_null())
                .primary_key(
                    Index::create()
                        .name("pk_tasks_tags")
                        .col(TasksTags::TaskId)
                        .col(TasksTags::TagId)
                )
                .foreign_key(
                    ForeignKey::create()
                        .name("fk_tasks_tags_task_id")
                        .from(TasksTags::Table, TasksTags::TaskId)
                        .to(Tasks::Table, Tasks::Id)
                        .on_delete(ForeignKeyAction::Cascade)
                        .on_update(ForeignKeyAction::Cascade)
                )
                .foreign_key(
                    ForeignKey::create()
                        .name("fk_tasks_tags_tag_id")
                        .from(TasksTags::Table, TasksTags::TagId)
                        .to(Tags::Table, Tags::Id)
                        .on_delete(ForeignKeyAction::Cascade)
                        .on_update(ForeignKeyAction::Cascade)
                )
                .to_owned()
        ).await?;

        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager.drop_table(Table::drop().table(TasksTags::Table).to_owned()).await?;
        manager.drop_table(Table::drop().table(ProjectsTags::Table).to_owned()).await?;
        manager.drop_table(Table::drop().table(SessionsTags::Table).to_owned()).await?;
        Ok(())
    }
}
