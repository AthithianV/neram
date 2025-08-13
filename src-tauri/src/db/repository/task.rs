use ::entity::tasks_tags::{ActiveModel as TaskTagsActiveModel, Entity as TaskTags};
use ::entity::{
    sessions::{Column as SessionColumn, Entity as Session, Relation as SessionRelation},
    tasks::{
        ActiveModel as TaskActiveModel, Column as TaskColumn, Entity as Task, Model as TaskModel,
        Relation as TaskRelation,
    },
};
use sea_orm::*;
use sea_orm::{sea_query::Expr, ColumnTrait, DbErr, EntityTrait, QueryFilter, QueryOrder};

use crate::models::task::{CreateTaskModel, ReadTaskModel};
use crate::time::now;

pub struct TaskRepository<'a> {
    db: &'a DatabaseConnection,
}

impl<'a> TaskRepository<'a> {
    pub fn new(db: &'a DatabaseConnection) -> Self {
        Self { db }
    }

    pub async fn create(&self, task: &CreateTaskModel) -> Result<TaskModel, DbErr> {
        let active_model = TaskActiveModel {
            title: Set(task.title.clone()),
            description: Set(task.description.clone()),
            project_id: Set(task.project_id),
            status: Set(task.status.clone()),
            priority: Set(task.priority.clone()),
            deadline: Set(task.deadline.clone()),
            started_at: Set(task.started_at.clone()),
            completed_at: Set(task.completed_at.clone()),
            estimated_time: Set(task.estimated_time),
            created_at: Set(now()),
            updated_at: Set(now()),
            ..Default::default()
        };

        let model = active_model.insert(self.db).await?;
        Ok(model)
    }

    pub async fn find_by_id(&self, task_id: i32) -> Result<Option<ReadTaskModel>, DbErr> {
        let task_with_duration = Task::find()
            .filter(TaskColumn::Id.eq(task_id))
            .join(JoinType::LeftJoin, TaskRelation::Sessions.def())
            .column_as(
                Expr::col((Session, SessionColumn::SessionDurationSec)).sum(),
                "total_duration_sec",
            )
            .group_by(TaskColumn::Id)
            .into_model::<ReadTaskModel>()
            .one(self.db)
            .await?;

        Ok(task_with_duration)
    }

    pub async fn find_all(&self) -> Result<Vec<ReadTaskModel>, DbErr> {
        // 1. Fetch all tasks for this project
        let tasks = Task::find()
            .column_as(Expr::value(0), "total_duration_sec")
            .order_by_asc(TaskColumn::Deadline)
            .order_by_asc(TaskColumn::Priority)
            .order_by_desc(TaskColumn::UpdatedAt)
            .into_model::<ReadTaskModel>()
            .all(self.db)
            .await?;

        // 2. Fetch durations grouped by task_id
        let durations: Vec<(i32, Option<i64>)> = Session::find()
            .select_only()
            .column(SessionColumn::TaskId)
            .column_as(
                Expr::col(SessionColumn::SessionDurationSec).sum(),
                "total_duration_sec",
            )
            .filter(SessionColumn::TaskId.is_in(tasks.iter().map(|t| t.id)))
            .group_by(SessionColumn::TaskId)
            .into_tuple()
            .all(self.db)
            .await?;

        // 3. Map durations into a lookup
        let duration_map: std::collections::HashMap<i32, i64> = durations
            .into_iter()
            .map(|(task_id, total)| (task_id, total.unwrap_or(0)))
            .collect();

        // 4. Merge into the tasks list
        let tasks_with_durations = tasks
            .into_iter()
            .map(|mut t| {
                t.total_duration_sec = duration_map.get(&t.id).and_then(|&dur| Some(dur));
                t
            })
            .collect::<Vec<_>>();

        Ok(tasks_with_durations)
    }

    pub async fn find_all_by_project_id(
        &self,
        project_id: i32,
    ) -> Result<Vec<ReadTaskModel>, DbErr> {
        // 1. Fetch all tasks for this project
        let tasks = Task::find()
            .column_as(Expr::value(0), "total_duration_sec")
            .filter(TaskColumn::ProjectId.eq(project_id))
            .order_by_asc(TaskColumn::Deadline)
            .order_by_asc(TaskColumn::Priority)
            .order_by_desc(TaskColumn::UpdatedAt)
            .into_model::<ReadTaskModel>()
            .all(self.db)
            .await?;

        // 2. Fetch durations grouped by task_id
        let durations: Vec<(i32, Option<i64>)> = Session::find()
            .select_only()
            .column(SessionColumn::TaskId)
            .column_as(
                Expr::col(SessionColumn::SessionDurationSec).sum(),
                "total_duration_sec",
            )
            .filter(SessionColumn::TaskId.is_in(tasks.iter().map(|t| t.id)))
            .group_by(SessionColumn::TaskId)
            .into_tuple()
            .all(self.db)
            .await?;

        // 3. Map durations into a lookup
        let duration_map: std::collections::HashMap<i32, i64> = durations
            .into_iter()
            .map(|(task_id, total)| (task_id, total.unwrap_or(0)))
            .collect();

        // 4. Merge into the tasks list
        let tasks_with_durations = tasks
            .into_iter()
            .map(|mut t| {
                t.total_duration_sec = duration_map.get(&t.id).and_then(|&dur| Some(dur));
                t
            })
            .collect::<Vec<_>>();

        Ok(tasks_with_durations)
    }

    pub async fn update(&self, task_id: i32, task: &CreateTaskModel) -> Result<(), DbErr> {
        let task_model = Task::find_by_id(task_id).one(self.db).await?;
        let mut task_active_model: TaskActiveModel = task_model.unwrap().into();

        task_active_model.title = Set(task.title.clone());
        task_active_model.description = Set(task.description.clone());
        task_active_model.project_id = Set(task.project_id);
        task_active_model.status = Set(task.status.clone());
        task_active_model.priority = Set(task.priority.clone());
        task_active_model.deadline = Set(task.deadline.clone());
        task_active_model.started_at = Set(task.started_at.clone());
        task_active_model.completed_at = Set(task.completed_at.clone());
        task_active_model.estimated_time = Set(task.estimated_time);
        task_active_model.updated_at = Set(now());

        let _ = task_active_model.update(self.db).await?;
        Ok(())
    }

    pub async fn delete(
        &self,
        id: i32,
        should_delete_sessions: bool,
    ) -> Result<DeleteResult, DbErr> {
        if should_delete_sessions {
            Session::delete_many()
                .filter(<Session as EntityTrait>::Column::TaskId.eq(id))
                .exec(self.db)
                .await?;
        } else {
            Session::update_many()
                .col_expr(
                    <Session as EntityTrait>::Column::TaskId,
                    sea_orm::prelude::Expr::value(None::<i32>),
                )
                .filter(<Session as EntityTrait>::Column::TaskId.eq(id))
                .exec(self.db)
                .await?;
        }

        let result = Task::delete_by_id(id).exec(self.db).await?;
        Ok(result)
    }

    pub async fn add_tag_to_task(&self, task_id: i32, tag_id: i32) -> Result<(), DbErr> {
        let active_model = TaskTagsActiveModel {
            task_id: Set(task_id),
            tag_id: Set(tag_id),
        };

        active_model.insert(self.db).await?;
        Ok(())
    }

    pub async fn remove_tag_from_task(&self, task_id: i32, tag_id: i32) -> Result<(), DbErr> {
        <TaskTags as EntityTrait>::delete_many()
            .filter(<TaskTags as EntityTrait>::Column::TaskId.eq(task_id))
            .filter(<TaskTags as EntityTrait>::Column::TagId.eq(tag_id))
            .exec(self.db)
            .await?;
        Ok(())
    }
}
