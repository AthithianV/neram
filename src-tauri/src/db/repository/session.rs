use sqlx::{ Result, Row, SqlitePool };
use crate::models::session::{ Related, SessioWithRelation, SessionModel };

pub struct SessionRepository<'a> {
    pool: &'a SqlitePool,
}

impl<'a> SessionRepository<'a> {
    pub fn new(pool: &'a SqlitePool) -> Self {
        Self { pool }
    }

    pub async fn create(&self, session: &SessionModel, tag_ids: Vec<u32>) -> Result<()> {
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
        "#;

        let new_session = sqlx
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
            .execute(self.pool).await?;

        for tag_id in tag_ids {
            let insert_tags =
                r#"
                INSERT INTO sessions_tags
                (session_id, tag_id)
                VALUES ($1, $2)
            "#;

            sqlx
                ::query(insert_tags)
                .bind(new_session.last_insert_rowid())
                .bind(tag_id)
                .execute(self.pool).await?;
        }

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

            tasks.id as task_id
            tasks.title as task_title,
            tasks.color as task_color,

            projects.id as project_id
            projects.title as project_title,
            projects.color as project_color
        FROM sessions
        LEFT JOIN tasks ON sessions.task_id = tasks.id
        LEFT JOIN projects ON projects.id = sessions.project_id
        WHERE sessions.id = ?
    "#;

        let row_opt = sqlx::query(query).bind(id).fetch_optional(self.pool).await?;

        // If no session found, return None
        let Some(row) = row_opt else {
            return Ok(None);
        };

        let tag_rows = sqlx
            ::query(
                r#"
        SELECT tags.title, tags.color, tags.id
        FROM tags
        INNER JOIN sessions_tags ON tags.id = sessions_tags.tag_id
        WHERE sessions_tags.session_id = ?
        "#
            )
            .bind(id)
            .fetch_all(self.pool).await?;

        let tags: Vec<Related> = tag_rows
            .iter()
            .map(|tag| Related {
                id: tag.get("id"),
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
                id: row.get("project_id"),
                title: row.get("project_title"),
                color: row.get("project_color"),
            },
            task: Related {
                id: row.get("task_id"),
                title: row.get("task_title"),
                color: row.get("task_color"),
            },
            tags,
        };

        Ok(Some(session))
    }

    pub async fn find_all(&self) -> Result<Vec<SessioWithRelation>> {
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

                tasks.id as task_id
                tasks.title as task_title,
                tasks.color as task_color,

                projects.id as project_id
                projects.title as project_title,
                projects.color as project_color
            FROM sessions
            LEFT JOIN tasks ON sessions.task_id = tasks.id
            LEFT JOIN projects ON projects.id = sessions.project_id
            LEFT JOIN (
                SELECT * FROM tags 
                INNER JOIN sessions_tags
                ON sessions_tags.tag_id = tags.id
            ) AS tags ON tags.session_id = sessions.id 
        "#;

        let rows = sqlx::query(query).fetch_all(self.pool).await?;

        let sessions = rows
            .iter()
            .map(|row| {
                let mut session = SessioWithRelation {
                    id: row.get("s_id"),
                    title: row.get("s_title"),
                    description: row.get("s_description"),
                    date: row.get("s_date"),
                    start_time: row.get("s_start_time"),
                    end_time: row.get("s_end_time"),
                    session_duration_sec: row.get("s_session_duration_sec"),
                    break_duration_sec: row.get("s_break_duration_sec"),
                    project: Related {
                        id: row.get("project_id"),
                        title: row.get("project_title"),
                        color: row.get("project_color"),
                    },
                    task: Related {
                        id: row.get("task_id"),
                        title: row.get("task_title"),
                        color: row.get("task_color"),
                    },
                    tags: Vec::<Related>::new(),
                };

                let tag_id: Option<i32> = row.get("tag_id");
                if tag_id.is_some() {
                    let tag = Related {
                        id: row.get("tag_id"),
                        title: row.get("tag_title"),
                        color: row.get("tag_color"),
                    };

                    if !session.tags.iter().any(|t| t.title == tag.title) {
                        session.tags.push(tag);
                    }
                }

                session
            })
            .collect();

        Ok(sessions)
    }

    pub async fn update(&self, session: &SessionModel) -> Result<()> {
        let update_query =
            r#"
            UPDATE sessions 
            SET 
                title = $1, 
                description = $2, 
                task_id = $3, 
                project_id = $4, 
                date = $5, 
                start_time = $6, 
                end_time = $7, 
                session_duration_sec = $8, 
                break_duration_sec = $9,
                updated_at = NOW()
            WHERE
                sessions.id = $10
        "#;

        sqlx
            ::query(update_query)
            .bind(session.title.clone())
            .bind(session.description.clone())
            .bind(session.task_id)
            .bind(session.project_id)
            .bind(session.date)
            .bind(session.start_time)
            .bind(session.end_time)
            .bind(session.session_duration_sec)
            .bind(session.break_duration_sec)
            .bind(session.id)
            .execute(self.pool).await?;

        Ok(())
    }

    pub async fn delete(&self, id: u32) -> Result<()> {
        let query = r#"
            DELETE FROM sessions WHERE id = ?;
        "#;
        sqlx::query(query).bind(id).execute(self.pool).await?;
        Ok(())
    }

    pub async fn add_tag_to_session(&self, session_id: u32, tag_id: u32) -> Result<()> {
        let query =
            r#"
            INSERT INTO sessions_tags
            (session_id, tag_id)
            VALUES ($1, $2);
        "#;
        sqlx::query(query).bind(session_id).bind(tag_id).execute(self.pool).await?;
        Ok(())
    }

    pub async fn remove_tag_from_session(&self, session_id: u32, tag_id: u32) -> Result<()> {
        let query =
            r#"
            DELETE FROM sessions_tags
            WHERE session_id = $1 AND tag_id = $2;
        "#;
        sqlx::query(query).bind(session_id).bind(tag_id).execute(self.pool).await?;
        Ok(())
    }
}
