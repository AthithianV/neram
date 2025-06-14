use sqlx::{ Result, Row, SqlitePool };
use crate::models::tag::{ TagModel };

pub struct TagRepository<'a> {
    pool: &'a SqlitePool,
}

impl<'a> TagRepository<'a> {
    pub fn new(pool: &'a SqlitePool) -> Self {
        Self { pool }
    }

    pub async fn create(&self, tag: &TagModel) -> Result<()> {
        let query =
            r#"
            INSERT INTO tags (
                title, 
                description, 
                color, 
                
                created_at,
                updated_at
            )
            VALUES ($1, $2, $3, NOW(), NOW())
        "#;

        sqlx
            ::query(query)
            .bind(tag.title.clone())
            .bind(tag.description.clone())
            .bind(tag.color.clone())
            .execute(self.pool).await?;

        Ok(())
    }

    pub async fn find_by_id(&self, id: u32) -> Result<Option<TagModel>> {
        let query =
            r#"
                SELECT *
                FROM tags
                WHERE tags.id = ?
            "#;

        let row_opt = sqlx::query(query).bind(id).fetch_optional(self.pool).await?;

        let Some(row) = row_opt else {
            return Ok(None);
        };

        let tag = TagModel {
            id: row.get("id"),
            title: row.get("title"),
            description: row.get("description"),
            color: row.get("color"),
            created_at: row.get("created_at"),
            updated_at: row.get("updated_at"),
        };

        Ok(Some(tag))
    }

    pub async fn find_all(&self) -> Result<Vec<TagModel>> {
        let query = r#"
                SELECT
                FROM tags
            "#;

        let rows = sqlx::query(query).fetch_all(self.pool).await?;

        let tags = rows
            .iter()
            .map(|row| {
                TagModel {
                    id: row.get("id"),
                    title: row.get("title"),
                    description: row.get("description"),
                    color: row.get("color"),
                    created_at: row.get("created_at"),
                    updated_at: row.get("updated_at"),
                }
            })
            .collect();

        Ok(tags)
    }

    pub async fn update(&self, tag: &TagModel) -> Result<()> {
        let update_query =
            r#"
            UPDATE tags 
            SET 
                title = $1, 
                description = $2, 
                color = $3, 
                updated_at = NOW()
            WHERE
                tags.id = $4
        "#;

        sqlx
            ::query(update_query)
            .bind(tag.title.clone())
            .bind(tag.description.clone())
            .bind(tag.color.clone())
            .bind(tag.id)
            .execute(self.pool).await?;

        Ok(())
    }

    pub async fn delete(&self, id: u32) -> Result<()> {
        let query = r#"
            DELETE FROM tags WHERE id = ?;
        "#;
        sqlx::query(query).bind(id).execute(self.pool).await?;
        Ok(())
    }
}
