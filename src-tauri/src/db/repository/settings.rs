use ::entity::settings::{
    ActiveModel as SettingsActiveModel, Entity as Settings, Model as SettingsModel,
};
use sea_orm::*;

use crate::models::settings::ReadSettingsModel;
// use crate::models::settings::Theme;

pub struct SettingsRepository<'a> {
    db: &'a DatabaseConnection,
}

impl<'a> SettingsRepository<'a> {
    pub fn new(db: &'a DatabaseConnection) -> Self {
        Self { db }
    }

    pub async fn get(&self) -> Result<ReadSettingsModel, DbErr> {
        let settings = Settings::find().one(self.db).await?;

        if let Some(s) = settings {
            Ok(ReadSettingsModel::from(s))
        } else {
            Err(DbErr::Custom("Cannot Find Settings".into()))
        }
    }

    pub async fn update(&self, settings: &SettingsModel) -> Result<SettingsModel, DbErr> {
        // Since there's no primary key, we'll update the first record or create one
        let existing = Settings::find().one(self.db).await?;

        if let Some(_) = existing {
            // Update existing settings
            let active_model = SettingsActiveModel {
                theme: Set(settings.theme.clone()),
                date_format: Set(settings.date_format.clone()),
                time_format: Set(settings.time_format.clone()),
                ..Default::default()
            };

            let model = active_model.update(self.db).await?;
            Ok(model)
        } else {
            // Create new settings
            let active_model = SettingsActiveModel {
                theme: Set(settings.theme.clone()),
                date_format: Set(settings.date_format.clone()),
                time_format: Set(settings.time_format.clone()),
                ..Default::default()
            };

            let model = active_model.insert(self.db).await?;
            Ok(model)
        }
    }
}
