use crate::models::pomodoro_settings::{ReadPomodoroSettings, UpdatePomodoroSettings};
use ::entity::pomodoro_settings::{
    ActiveModel as ActivePomodoroSettings, Entity as PomodoroSettings,
};
use sea_orm::*;

pub struct PomodoroSettingsRepository<'a> {
    db: &'a DatabaseConnection,
}

impl<'a> PomodoroSettingsRepository<'a> {
    pub fn new(db: &'a DatabaseConnection) -> Self {
        Self { db }
    }

    pub async fn get(&self) -> Result<ReadPomodoroSettings, DbErr> {
        let settings = PomodoroSettings::find().one(self.db).await?;

        let mut result = ReadPomodoroSettings {
            session_duration: 1500,
            session_count: 4,
            break_duration: 300,
            auto_start: true,
            sync_with_time_tracking: true,
        };

        if let Some(settings) = settings {
            result.session_duration = settings.session_duration;
            result.session_count = settings.session_count;
            result.break_duration = settings.break_duration;
            result.auto_start = settings.auto_start;
            result.sync_with_time_tracking = settings.sync_with_time_tracking;
        }

        Ok(result)
    }

    pub async fn update(&self, settings_to_update: UpdatePomodoroSettings) -> Result<(), DbErr> {
        let current_settings = PomodoroSettings::find().one(self.db).await?;
        let mut active_pomodoro_settings: ActivePomodoroSettings = current_settings.unwrap().into();

        let UpdatePomodoroSettings {
            session_duration,
            session_count,
            break_duration,
            auto_start,
            sync_with_time_tracking,
        } = settings_to_update;

        if let Some(session_duration) = session_duration {
            active_pomodoro_settings.session_duration = Set(session_duration);
        }

        if let Some(session_count) = session_count {
            active_pomodoro_settings.session_count = Set(session_count);
        }

        if let Some(break_duration) = break_duration {
            active_pomodoro_settings.break_duration = Set(break_duration);
        }

        if let Some(auto_start) = auto_start {
            active_pomodoro_settings.auto_start = Set(auto_start);
        }

        if let Some(sync_with_time_tracking) = sync_with_time_tracking {
            active_pomodoro_settings.sync_with_time_tracking = Set(sync_with_time_tracking);
        }

        active_pomodoro_settings.update(self.db).await?;

        Ok(())
    }
}
