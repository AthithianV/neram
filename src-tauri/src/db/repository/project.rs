use sqlx::{ Result, Row, SqlitePool };
use crate::models::project::{ ProjectModel };

pub struct ProjectRepository<'a> {
    pool: &'a SqlitePool,
}

impl<'a> ProjectRepository<'a> {
    pub fn new(pool: &'a SqlitePool) -> Self {
        Self { pool }
    }

    pub async fn create(&self, project: &ProjectModel, tag_ids: Vec<u32>) -> Result<()> {
        let query =
            r#"
            INSERT INTO Projects (
                title, 
                description, 
                color, 

                client_name, 
                status,

                deadline,
                started_at,
                completed_at,

                is_billable,
                billing_type,
                hourly_rate,
                fixed_rate,
                currency
                
                created_at,
                updated_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), NOW())
        "#;

        let new_project = sqlx
            ::query(query)
            .bind(project.title.clone())
            .bind(project.description.clone())
            .bind(project.color.clone())
            .bind(project.client_name.clone())
            .bind(project.status.clone())
            .bind(project.deadline)
            .bind(project.started_at)
            .bind(project.completed_at)
            .bind(project.is_billable)
            .bind(project.billing_type.clone())
            .bind(project.hourly_rate)
            .bind(project.fixed_rate)
            .bind(project.currency.clone())
            .execute(self.pool).await?;

        for tag_id in tag_ids {
            let insert_tags =
                r#"
                INSERT INTO projects_tags
                (project_id, tag_id)
                VALUES ($1, $2)
            "#;

            sqlx
                ::query(insert_tags)
                .bind(new_project.last_insert_rowid())
                .bind(tag_id)
                .execute(self.pool).await?;
        }

        Ok(())
    }

    pub async fn find_by_id(&self, id: u32) -> Result<Option<ProjectModel>> {
        let query =
            r#"
                SELECT *
                FROM projects
                WHERE projects.id = ?
            "#;

        let row_opt = sqlx::query(query).bind(id).fetch_optional(self.pool).await?;

        let Some(row) = row_opt else {
            return Ok(None);
        };

        let project = ProjectModel {
            id: row.get("id"),
            title: row.get("title"),
            description: row.get("description"),
            color: row.get("color"),
            status: row.get("status"),
            client_name: row.get("client_name"),
            deadline: row.get("deadline"),
            started_at: row.get("started_at"),
            completed_at: row.get("completed_at"),
            is_billable: row.get("is_billable"),
            billing_type: row.get("billing_type"),
            hourly_rate: row.get("hourly_rate"),
            fixed_rate: row.get("fixed_rate"),
            currency: row.get("currency"),
            created_at: row.get("created_at"),
            updated_at: row.get("updated_at"),
        };

        Ok(Some(project))
    }

    pub async fn find_all(&self) -> Result<Vec<ProjectModel>> {
        let query = r#"
                SELECT
                FROM projects
            "#;

        let rows = sqlx::query(query).fetch_all(self.pool).await?;

        let projects = rows
            .iter()
            .map(|row| {
                ProjectModel {
                    id: row.get("id"),
                    title: row.get("title"),
                    description: row.get("description"),
                    color: row.get("color"),
                    status: row.get("status"),
                    client_name: row.get("client_name"),
                    deadline: row.get("deadline"),
                    started_at: row.get("started_at"),
                    completed_at: row.get("completed_at"),
                    is_billable: row.get("is_billable"),
                    billing_type: row.get("billing_type"),
                    hourly_rate: row.get("hourly_rate"),
                    fixed_rate: row.get("fixed_rate"),
                    currency: row.get("currency"),
                    created_at: row.get("created_at"),
                    updated_at: row.get("updated_at"),
                }
            })
            .collect();

        Ok(projects)
    }

    pub async fn update(&self, project: &ProjectModel) -> Result<()> {
        let update_query =
            r#"
            UPDATE projects 
            SET 
                title = $1, 
                description = $2, 
                color = $3, 
                client_name = $4, 
                status = $5, 
                deadline = $6, 
                started_at = $8, 
                completed_at = $9,
                is_billable = $10,
                billing_type = $10,
                hourly_rate = $10,
                fixed_rate = $10,
                currency = $10,
                updated_at = NOW()
            WHERE
                Projects.id = $11
        "#;

        sqlx
            ::query(update_query)
            .bind(project.title.clone())
            .bind(project.description.clone())
            .bind(project.color.clone())
            .bind(project.client_name.clone())
            .bind(project.status.clone())
            .bind(project.deadline)
            .bind(project.started_at)
            .bind(project.completed_at)
            .bind(project.is_billable)
            .bind(project.billing_type.clone())
            .bind(project.hourly_rate)
            .bind(project.fixed_rate)
            .bind(project.currency.clone())
            .execute(self.pool).await?;

        Ok(())
    }

    pub async fn delete(&self, id: u32) -> Result<()> {
        let query = r#"
            DELETE FROM projects WHERE id = ?;
        "#;
        sqlx::query(query).bind(id).execute(self.pool).await?;
        Ok(())
    }

    pub async fn add_tag_to_project(&self, project_id: u32, tag_id: u32) -> Result<()> {
        let query =
            r#"
            INSERT INTO projects_tags
            (project_id, tag_id)
            VALUES ($1, $2);
        "#;
        sqlx::query(query).bind(project_id).bind(tag_id).execute(self.pool).await?;
        Ok(())
    }

    pub async fn remove_tag_from_project(&self, project_id: u32, tag_id: u32) -> Result<()> {
        let query =
            r#"
            DELETE FROM projects_tags
            WHERE Project_id = $1 AND tag_id = $2;
        "#;
        sqlx::query(query).bind(project_id).bind(tag_id).execute(self.pool).await?;
        Ok(())
    }
}
