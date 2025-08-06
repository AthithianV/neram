use ::entity::settings::{ActiveModel as SettingsActiveModel, Entity as Settings};
use sea_orm::*;

use crate::models::settings::{ReadSettingsModel, UpdateSettingsModel};
// use crate::models::settings::Theme;

pub struct SettingsRepository<'a> {
    db: &'a DatabaseConnection,
}

impl<'a> SettingsRepository<'a> {
    pub fn new(db: &'a DatabaseConnection) -> Self {
        Self { db }
    }

    pub async fn get(&self) -> Result<ReadSettingsModel, DbErr> {
        let settings = Settings::find().all(self.db).await?;
        Ok(ReadSettingsModel::from(settings.first().unwrap()))
    }

    pub async fn update(&self, settings_to_update: UpdateSettingsModel) -> Result<(), DbErr> {
        let settings = Settings::find().all(self.db).await?;
        let setting_model = settings
            .first()
            .ok_or(DbErr::Custom("Settings not found".into()))?
            .clone();
        let mut current_setting: SettingsActiveModel = setting_model.into();

        if let Some(theme) = settings_to_update.theme {
            current_setting.theme = Set(theme);
        }

        if let Some(date_format) = settings_to_update.date_format {
            current_setting.date_format = Set(date_format);
        }

        if let Some(time_format) = settings_to_update.time_format {
            current_setting.time_format = Set(time_format);
        }

        current_setting.update(self.db).await?;
        Ok(())
    }
}
