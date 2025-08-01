use ::entity::tags::{ActiveModel as TagActiveModel, Entity as Tag, Model as TagModel};
use sea_orm::*;

use crate::{models::tag::ReadTagModel, time::now};

pub struct TagRepository<'a> {
    db: &'a DatabaseConnection,
}

impl<'a> TagRepository<'a> {
    pub fn new(db: &'a DatabaseConnection) -> Self {
        Self { db }
    }

    pub async fn create(&self, tag: &TagModel) -> Result<TagModel, DbErr> {
        let active_model = TagActiveModel {
            title: Set(tag.title.clone()),
            description: Set(tag.description.clone()),
            color: Set(tag.color.clone()),
            created_at: Set(now()),
            updated_at: Set(now()),
            ..Default::default()
        };

        let model = active_model.insert(self.db).await?;
        Ok(model)
    }

    pub async fn find_by_id(&self, id: i32) -> Result<Option<TagModel>, DbErr> {
        let tag = Tag::find_by_id(id).one(self.db).await?;
        Ok(tag)
    }

    pub async fn find_all(&self) -> Result<Vec<ReadTagModel>, DbErr> {
        let tags = Tag::find().all(self.db).await?;
        let minimal_tags = tags
            .into_iter()
            .map(|tag| ReadTagModel::from(tag))
            .collect();
        Ok(minimal_tags)
    }

    pub async fn update(&self, tag: &TagModel) -> Result<TagModel, DbErr> {
        let active_model = TagActiveModel {
            id: Set(tag.id),
            title: Set(tag.title.clone()),
            description: Set(tag.description.clone()),
            color: Set(tag.color.clone()),
            updated_at: Set(now()),
            ..Default::default()
        };

        let model = active_model.update(self.db).await?;
        Ok(model)
    }

    pub async fn delete(&self, id: i32) -> Result<DeleteResult, DbErr> {
        let result = Tag::delete_by_id(id).exec(self.db).await?;
        Ok(result)
    }
}
