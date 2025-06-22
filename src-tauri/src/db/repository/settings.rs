use sea_orm::*;
use crate::models::settings::{
    Entity as Settings,
    Model as SettingsModel,
    ActiveModel as SettingsActiveModel,
    Theme,
};

pub struct SettingsRepository<'a> {
    db: &'a DatabaseConnection,
}

impl<'a> SettingsRepository<'a> {
    pub fn new(db: &'a DatabaseConnection) -> Self {
        Self { db }
    }

    pub async fn get_settings(&self) -> Result<Option<SettingsModel>, DbErr> {
        let settings = Settings::find().one(self.db).await?;
        Ok(settings)
    }

    pub async fn update_settings(&self, settings: &SettingsModel) -> Result<SettingsModel, DbErr> {
        // Since there's no primary key, we'll update the first record or create one
        let existing = Settings::find().one(self.db).await?;

        if let Some(existing) = existing {
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
