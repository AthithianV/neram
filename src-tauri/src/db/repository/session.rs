use sqlx::{ SqlitePool, Result, Row };
use crate::models::session::{ Related, SessioWithRelation, SessionModel };

pub struct SessionRepository {
    pool: SqlitePool,
}

impl SessionRepository {
    pub fn new(pool: SqlitePool) -> Self {
        Self { pool }
    }

    pub async fn create(&self, session: &SessionModel) -> Result<()> {
        let query =
            r#"
        INSERT INTO sessions (
            title, 
            description, 
            task_id, 
            project_id, 
            date, 
            start_time, 
            end_time, 
            session_duration_sec, 
            break_duration_sec,
            created_at,
            updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
        RETURNING 
            id,
            title,
            description,
            task_id,
            project_id,
            date,
            start_time,
            end_time,
            session_duration_sec,
            break_duration_sec,
            created_at,
            updated_at
        "#;

        sqlx
            ::query(query)
            .bind(session.title.clone())
            .bind(session.description.clone())
            .bind(session.task_id)
            .bind(session.project_id)
            .bind(session.date)
            .bind(session.start_time)
            .bind(session.end_time)
            .bind(session.session_duration_sec)
            .bind(session.break_duration_sec)
            .execute(&self.pool).await?;

        Ok(())
    }

    pub async fn find_by_id(&self, id: u32) -> Result<Option<SessioWithRelation>> {
        // Step 1: Fetch session + task + project
        let query =
            r#"
        SELECT
            sessions.id as s_id,
            sessions.title as s_title,
            sessions.description as s_description,
            sessions.date as s_date,
            sessions.start_time as s_start_time,
            sessions.end_time as s_end_time,
            sessions.session_duration_sec as s_session_duration_sec,
            sessions.break_duration_sec as s_break_duration_sec,
            tasks.title as task_title,
            tasks.color as task_color,
            projects.title as project_title,
            projects.color as project_color
        FROM sessions
        LEFT JOIN tasks ON sessions.task_id = tasks.id
        LEFT JOIN projects ON projects.id = sessions.project_id
        WHERE sessions.id = ?
    "#;

        let row_opt = sqlx::query(query).bind(id).fetch_optional(&self.pool).await?;

        // If no session found, return None
        let Some(row) = row_opt else {
            return Ok(None);
        };

        let tag_rows = sqlx
            ::query(
                r#"
        SELECT tags.title, tags.color
        FROM tags
        INNER JOIN sessions_tags ON tags.id = sessions_tags.tag_id
        WHERE sessions_tags.session_id = ?
        "#
            )
            .bind(id)
            .fetch_all(&self.pool).await?;

        let tags: Vec<Related> = tag_rows
            .iter()
            .map(|tag| Related {
                title: tag.get("title"),
                color: tag.get("color"),
            })
            .collect();

        let session = SessioWithRelation {
            id: row.get("s_id"),
            title: row.get("s_title"),
            description: row.get("s_description"),
            date: row.get("s_date"),
            start_time: row.get("s_start_time"),
            end_time: row.get("s_end_time"),
            session_duration_sec: row.get("s_session_duration_sec"),
            break_duration_sec: row.get("s_break_duration_sec"),
            project: Related {
                title: row.get("project_title"),
                color: row.get("project_color"),
            },
            task: Related {
                title: row.get("task_title"),
                color: row.get("task_color"),
            },
            tags,
        };

        Ok(Some(session))
    }

    // pub async fn find_all(&self) -> Result<Option<SessionModel>> {}

    // pub async fn update(&self, session: &SessionModel) -> Result<SessionModel> {
    //     // UPDATE logic
    // }

    pub async fn delete(&self, id: u32) -> Result<()> {
        let query = r#"
            DELETE FROM sessions WHERE id = ?;
        "#;

        sqlx::query(query).bind(id).execute(&self.pool).await?;
        Ok(())
    }

    // pub async fn find_by_project_id(&self, project_id: u32) -> Result<Vec<SessionModel>> {
    //     // Custom query logic
    // }
}
