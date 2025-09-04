use ::entity::tags;
use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
pub struct ReadTagModel {
    pub id: i32,
    pub title: String,
    pub description: Option<String>,
    pub color: String,
}

#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
pub struct CreateTagModel {
    pub title: String,
    pub description: Option<String>,
    pub color: String,
}

impl From<tags::Model> for ReadTagModel {
    fn from(tag: tags::Model) -> Self {
        Self {
            id: tag.id,
            title: tag.title,
            color: tag.color,
            description: tag.description,
        }
    }
}
