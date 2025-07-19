use ::entity::pomodoro_settings::{
    ActiveModel as PomodoroSettingsActiveModel, Entity as PomodoroSettings,
    Model as PomodoroSettingsModel,
};
use sea_orm::*;

pub struct PomodoroSettingsRepository<'a> {
    db: &'a DatabaseConnection,
}

impl<'a> PomodoroSettingsRepository<'a> {
    pub fn new(db: &'a DatabaseConnection) -> Self {
        Self { db }
    }

    pub async fn get_settings(&self) -> Result<Option<PomodoroSettingsModel>, DbErr> {
        let settings = PomodoroSettings::find().one(self.db).await?;
        Ok(settings)
    }

    pub async fn update_settings(
        &self,
        settings: &PomodoroSettingsModel,
    ) -> Result<PomodoroSettingsModel, DbErr> {
        // Since there's no primary key, we'll update the first record or create one
        let existing = PomodoroSettings::find().one(self.db).await?;

        if let Some(_) = existing {
            // Update existing settings
            let active_model = PomodoroSettingsActiveModel {
                session_duration: Set(settings.session_duration),
                session_count: Set(settings.session_count),
                break_duration: Set(settings.break_duration),
                auto_start: Set(settings.auto_start),
                sync_with_time_tracking: Set(settings.sync_with_time_tracking),
                ..Default::default()
            };

            let model = active_model.update(self.db).await?;
            Ok(model)
        } else {
            // Create new settings
            let active_model = PomodoroSettingsActiveModel {
                session_duration: Set(settings.session_duration),
                session_count: Set(settings.session_count),
                break_duration: Set(settings.break_duration),
                auto_start: Set(settings.auto_start),
                sync_with_time_tracking: Set(settings.sync_with_time_tracking),
                ..Default::default()
            };

            let model = active_model.insert(self.db).await?;
            Ok(model)
        }
    }
}
