use sqlx::{ Result, Row, SqlitePool };
use crate::models::task::{ TaskModel };

pub struct TaskRepository<'a> {
    pool: &'a SqlitePool,
}

impl<'a> TaskRepository<'a> {
    pub fn new(pool: &'a SqlitePool) -> Self {
        Self { pool }
    }

    pub async fn create(&self, task: &TaskModel, tag_ids: Vec<u32>) -> Result<()> {
        let query =
            r#"
            INSERT INTO tasks (
                title, 
                description, 
                color, 
                project_id, 
                status, 
                priority

                deadline,
                started_at,
                completed_at,
                estimated_time
                
                created_at,
                updated_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
        "#;

        let new_task = sqlx
            ::query(query)
            .bind(task.title.clone())
            .bind(task.description.clone())
            .bind(task.color.clone())
            .bind(task.project_id)
            .bind(task.status.clone())
            .bind(task.priority.clone())
            .bind(task.deadline)
            .bind(task.started_at)
            .bind(task.completed_at)
            .bind(task.estimated_time)
            .execute(self.pool).await?;

        for tag_id in tag_ids {
            let insert_tags =
                r#"
                INSERT INTO tasks_tags
                (task_id, tag_id)
                VALUES ($1, $2)
            "#;

            sqlx
                ::query(insert_tags)
                .bind(new_task.last_insert_rowid())
                .bind(tag_id)
                .execute(self.pool).await?;
        }

        Ok(())
    }

    pub async fn find_by_id(&self, id: u32) -> Result<Option<TaskModel>> {
        let query =
            r#"
                SELECT *
                FROM tasks
                WHERE tasks.id = ?
            "#;

        let row_opt = sqlx::query(query).bind(id).fetch_optional(self.pool).await?;

        let Some(row) = row_opt else {
            return Ok(None);
        };

        let task = TaskModel {
            id: row.get("id"),
            title: row.get("title"),
            description: row.get("description"),
            color: row.get("color"),
            status: row.get("status"),
            project_id: row.get("project_id"),
            priority: row.get("priority"),
            deadline: row.get("deadline"),
            started_at: row.get("started_at"),
            completed_at: row.get("completed_at"),
            estimated_time: row.get("estimated_time"),
            created_at: row.get("created_at"),
            updated_at: row.get("updated_at"),
        };

        Ok(Some(task))
    }

    pub async fn find_all(&self) -> Result<Vec<TaskModel>> {
        let query = r#"
                SELECT
                FROM tasks
            "#;

        let rows = sqlx::query(query).fetch_all(self.pool).await?;

        let tasks = rows
            .iter()
            .map(|row| {
                TaskModel {
                    id: row.get("id"),
                    title: row.get("title"),
                    description: row.get("description"),
                    color: row.get("color"),
                    status: row.get("status"),
                    project_id: row.get("project_id"),
                    priority: row.get("priority"),
                    deadline: row.get("deadline"),
                    started_at: row.get("started_at"),
                    completed_at: row.get("completed_at"),
                    estimated_time: row.get("estimated_time"),
                    created_at: row.get("created_at"),
                    updated_at: row.get("updated_at"),
                }
            })
            .collect();

        Ok(tasks)
    }

    pub async fn update(&self, task: &TaskModel) -> Result<()> {
        let update_query =
            r#"
            UPDATE tasks 
            SET 
                title = $1, 
                description = $2, 
                color = $3, 
                project_id = $4, 
                status = $5, 
                priority = $6, 
                deadline = $7, 
                started_at = $8, 
                completed_at = $9,
                estimated_time = $10,
                updated_at = NOW()
            WHERE
                tasks.id = $11
        "#;

        sqlx
            ::query(update_query)
            .bind(task.title.clone())
            .bind(task.description.clone())
            .bind(task.color.clone())
            .bind(task.project_id)
            .bind(task.status.clone())
            .bind(task.priority.clone())
            .bind(task.deadline)
            .bind(task.started_at)
            .bind(task.completed_at)
            .bind(task.estimated_time)
            .bind(task.id)
            .execute(self.pool).await?;

        Ok(())
    }

    pub async fn delete(&self, id: u32) -> Result<()> {
        let query = r#"
            DELETE FROM tasks WHERE id = ?;
        "#;
        sqlx::query(query).bind(id).execute(self.pool).await?;
        Ok(())
    }

    pub async fn add_tag_to_task(&self, task_id: u32, tag_id: u32) -> Result<()> {
        let query =
            r#"
            INSERT INTO tasks_tags
            (task_id, tag_id)
            VALUES ($1, $2);
        "#;
        sqlx::query(query).bind(task_id).bind(tag_id).execute(self.pool).await?;
        Ok(())
    }

    pub async fn remove_tag_from_task(&self, task_id: u32, tag_id: u32) -> Result<()> {
        let query =
            r#"
            DELETE FROM tasks_tags
            WHERE task_id = $1 AND tag_id = $2;
        "#;
        sqlx::query(query).bind(task_id).bind(tag_id).execute(self.pool).await?;
        Ok(())
    }
}
