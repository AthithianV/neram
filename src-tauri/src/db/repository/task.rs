use ::entity::tasks::{
    ActiveModel as TaskActiveModel, Column as TaskColumn, Entity as Task, Model as TaskModel,
};
use ::entity::tasks_tags::{ActiveModel as TaskTagsActiveModel, Entity as TaskTags};
use sea_orm::*;

use crate::models::task::{CreateTaskModel, ReadTaskModel};
use crate::time::now;
use ::entity::sessions::{Column as SessionColumn, Entity as Session};

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

    pub async fn find_by_id(&self, id: i32) -> Result<Option<ReadTaskModel>, DbErr> {
        let task_opt = Task::find_by_id(id).one(self.db).await?;
        let task = match task_opt {
            Some(t) => Some(ReadTaskModel::from(t)),
            None => None,
        };
        Ok(task)
    }

    pub async fn find_all(&self) -> Result<Vec<ReadTaskModel>, DbErr> {
        let tasks = Task::find().all(self.db).await?;
        let tasks = tasks
            .into_iter()
            .map(|task| ReadTaskModel::from(task))
            .collect();
        Ok(tasks)
    }

    pub async fn find_all_by_project_id(
        &self,
        project_id: i32,
    ) -> Result<Vec<ReadTaskModel>, DbErr> {
        let tasks = Task::find()
            .filter(TaskColumn::ProjectId.eq(project_id))
            .order_by_desc(TaskColumn::UpdatedAt)
            .all(self.db)
            .await?;
        let tasks = tasks
            .into_iter()
            .map(|task| ReadTaskModel::from(task))
            .collect();
        Ok(tasks)
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

    pub async fn delete(&self, id: i32) -> Result<DeleteResult, DbErr> {
        let _ = Session::delete_many()
            .filter(SessionColumn::TaskId.eq(id))
            .exec(self.db)
            .await?;
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
