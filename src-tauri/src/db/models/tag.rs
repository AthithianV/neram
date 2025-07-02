use ::entity::tags;
use serde::{ Deserialize, Serialize };

#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
pub struct TagModel {
    pub id: i32,
    pub title: String,
    pub description: Option<String>,
    pub color: Option<String>,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
pub struct CreateTagModel {
    pub title: String,
    pub description: Option<String>,
    pub color: Option<String>,
}

#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
pub struct MiniTag {
    pub id: i32,
    pub title: String,
    pub color: Option<String>,
}

impl From<tags::Model> for MiniTag {
    fn from(tag: tags::Model) -> Self {
        Self {
            id: tag.id,
            title: tag.title,
            color: tag.color,
        }
    }
}
