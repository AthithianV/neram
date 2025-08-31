use ::entity::sessions_tags::Entity as SessionTag;
use ::entity::tags::{ActiveModel as TagActiveModel, Entity as Tag};
use sea_orm::*;

use crate::{
    models::tag::{CreateTagModel, ReadTagModel},
    time::now,
};

pub struct TagRepository<'a> {
    db: &'a DatabaseConnection,
}

impl<'a> TagRepository<'a> {
    pub fn new(db: &'a DatabaseConnection) -> Self {
        Self { db }
    }

    pub async fn create(&self, tag: &CreateTagModel) -> Result<(), DbErr> {
        let active_model = TagActiveModel {
            title: Set(tag.title.clone()),
            description: Set(tag.description.clone()),
            color: Set(tag.color.clone()),
            created_at: Set(now()),
            updated_at: Set(now()),
            ..Default::default()
        };

        let _ = active_model.insert(self.db).await?;
        Ok(())
    }

    pub async fn find_by_id(&self, id: i32) -> Result<Option<ReadTagModel>, DbErr> {
        let tag_model = Tag::find_by_id(id).one(self.db).await?;
        let tag = tag_model.map(ReadTagModel::from);

        Ok(tag)
    }

    pub async fn find_all(&self) -> Result<Vec<ReadTagModel>, DbErr> {
        let tags = Tag::find().all(self.db).await?;
        let read_tags = tags
            .into_iter()
            .map(|tag| ReadTagModel::from(tag))
            .collect();
        Ok(read_tags)
    }

    pub async fn update(&self, tag_id: i32, tag_to_update: &CreateTagModel) -> Result<(), DbErr> {
        let tag_model = Tag::find_by_id(tag_id).one(self.db).await?;
        let mut active_tag_model: TagActiveModel = tag_model.unwrap().into();

        active_tag_model.title = Set(tag_to_update.title.clone());
        active_tag_model.color = Set(tag_to_update.color.clone());
        active_tag_model.description = Set(tag_to_update.description.clone());
        active_tag_model.updated_at = Set(now());

        let _ = active_tag_model.update(self.db).await?;
        Ok(())
    }

    pub async fn delete(&self, id: i32) -> Result<DeleteResult, DbErr> {
        <SessionTag as EntityTrait>::delete_many()
            .filter(<SessionTag as EntityTrait>::Column::TagId.eq(id))
            .exec(self.db)
            .await?;
        let result = Tag::delete_by_id(id).exec(self.db).await?;
        Ok(result)
    }
}
