use ::entity::pomodoro_settings::{
    Entity as PomodoroSettings
};
use models::pomodoro_settings::{ReadPomodoroSettings, UpdatePomodoroSettings};
use sea_orm::*;

pub struct PomodoroSettingsRepository<'a> {
    db: &'a DatabaseConnection,
}

impl<'a> PomodoroSettingsRepository<'a> {
    pub fn new(db: &'a DatabaseConnection) -> Self {
        Self { db }
    }

    pub async fn get(&self) -> Result<Option<ReadPomodoroSettings>, DbErr> {
        let settings = PomodoroSettings::find().one(self.db).await?;
        Ok(settings)
    }

    pub async fn update(
        &self,
        settings_to_update: UpdatePomodoroSettings,
    ) -> Result<(), DbErr> {

        let currentSettings = PomodoroSettings::find().one(self.db).await?;

        let {session_duration,
        session_count,
        break_duration,
        auto_start,
        sync_with_time_tracking} = settings_to_update;

        if let Some(session_duration) = session_duration {
            currentSettings.session_duration = Set(session_duration);
        }

        if let Some(break_duration) = break_duration {
            currentSettings.break_duration = Set(break_duration);
        }

        if let Some(auto_start) = auto_start {
            currentSettings.auto_start = Set(auto_start);
        }

        if let Some(sync_with_time_tracking) = sync_with_time_tracking {
            currentSettings.sync_with_time_tracking = Set(sync_with_time_tracking);
        }

        await currentSettings.update(self.db).await?;
        Ok(())
    }
}
