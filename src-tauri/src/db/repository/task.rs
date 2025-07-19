use ::entity::tasks::{
    ActiveModel as TaskActiveModel, Column as TaskColumn, Entity as Task, Model as TaskModel,
};
use ::entity::tasks_tags::{ActiveModel as TaskTagsActiveModel, Entity as TaskTags};
use sea_orm::*;

use crate::models::task::ReadTaskModel;

pub struct TaskRepository<'a> {
    db: &'a DatabaseConnection,
}

impl<'a> TaskRepository<'a> {
    pub fn new(db: &'a DatabaseConnection) -> Self {
        Self { db }
    }

    pub async fn create(&self, task: &TaskModel) -> Result<TaskModel, DbErr> {
        let active_model = TaskActiveModel {
            title: Set(task.title.clone()),
            description: Set(task.description.clone()),
            color: Set(task.color.clone()),
            project_id: Set(task.project_id),
            status: Set(task.status.clone()),
            priority: Set(task.priority.clone()),
            deadline: Set(task.deadline.clone()),
            started_at: Set(task.started_at.clone()),
            completed_at: Set(task.completed_at.clone()),
            estimated_time: Set(task.estimated_time),
            created_at: Set("CURRENT_TIMESTAMP".to_string()),
            updated_at: Set("CURRENT_TIMESTAMP".to_string()),
            ..Default::default()
        };

        let model = active_model.insert(self.db).await?;
        Ok(model)
    }

    pub async fn find_by_id(&self, id: i32) -> Result<Option<TaskModel>, DbErr> {
        let task = Task::find_by_id(id).one(self.db).await?;
        Ok(task)
    }

    pub async fn find_all(&self) -> Result<Vec<ReadTaskModel>, DbErr> {
        let tasks = Task::find().all(self.db).await?;
        let tasks = tasks
            .into_iter()
            .map(|task| ReadTaskModel {
                id: task.id,
                title: task.title,
                description: task.description,
                color: task.color,
                status: task.status,
                project_id: task.project_id,
                priority: task.priority,
                deadline: task.deadline,
                started_at: task.started_at,
                completed_at: task.completed_at,
                estimated_time: task.estimated_time,
                created_at: task.created_at,
                updated_at: task.updated_at,
            })
            .collect();
        Ok(tasks)
    }

    pub async fn find_all_by_project_id(
        &self,
        project_id: i32,
    ) -> Result<Vec<ReadTaskModel>, DbErr> {
        let tasks = Task::find()
            .filter(TaskColumn::ProjectId.eq(project_id))
            .all(self.db)
            .await?;
        let tasks = tasks
            .into_iter()
            .map(|task| ReadTaskModel {
                id: task.id,
                title: task.title,
                description: task.description,
                color: task.color,
                status: task.status,
                project_id: task.project_id,
                priority: task.priority,
                deadline: task.deadline,
                started_at: task.started_at,
                completed_at: task.completed_at,
                estimated_time: task.estimated_time,
                created_at: task.created_at,
                updated_at: task.updated_at,
            })
            .collect();
        Ok(tasks)
    }

    pub async fn update(&self, task: &TaskModel) -> Result<TaskModel, DbErr> {
        let active_model = TaskActiveModel {
            id: Set(task.id),
            title: Set(task.title.clone()),
            description: Set(task.description.clone()),
            color: Set(task.color.clone()),
            project_id: Set(task.project_id),
            status: Set(task.status.clone()),
            priority: Set(task.priority.clone()),
            deadline: Set(task.deadline.clone()),
            started_at: Set(task.started_at.clone()),
            completed_at: Set(task.completed_at.clone()),
            estimated_time: Set(task.estimated_time),
            updated_at: Set("CURRENT_TIMESTAMP".to_string()),
            ..Default::default()
        };

        let model = active_model.update(self.db).await?;
        Ok(model)
    }

    pub async fn delete(&self, id: i32) -> Result<DeleteResult, DbErr> {
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
