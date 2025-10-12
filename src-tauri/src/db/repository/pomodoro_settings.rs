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
            session_completed: 0,
            break_completed: 0,
            notification_sound: false,
            default_project: None,
        };

        if let Some(settings) = settings {
            result.session_duration = settings.session_duration;
            result.session_count = settings.session_count;
            result.break_duration = settings.break_duration;
            result.auto_start = settings.auto_start;
            result.sync_with_time_tracking = settings.sync_with_time_tracking;
            result.session_completed = settings.session_completed;
            result.break_completed = settings.break_completed;
            result.notification_sound = settings.notification_sound;
            result.default_project = settings.default_project
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
            session_completed,
            break_completed,
            notification_sound,
            default_project,
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

        if let Some(session_completed) = session_completed {
            active_pomodoro_settings.session_completed = Set(session_completed);
        }

        if let Some(break_completed) = break_completed {
            active_pomodoro_settings.break_completed = Set(break_completed);
        }

        if let Some(notification_sound) = notification_sound {
            active_pomodoro_settings.notification_sound = Set(notification_sound);
        }

        if let Some(default_project) = default_project {
            active_pomodoro_settings.default_project = Set(default_project);
        }

        active_pomodoro_settings.update(self.db).await?;

        Ok(())
    }

    pub async fn check_and_remove_project(&self, project_id: i32) -> Result<(), DbErr> {
        println!("I am checking...");
        let current_settings = PomodoroSettings::find().one(self.db).await?;

        if let Some(settings) = current_settings {
            if let Some(current_project_id) = settings.default_project {
                if current_project_id == project_id {
                    let mut active_pomodoro_settings: ActivePomodoroSettings = settings.into();

                    active_pomodoro_settings.default_project = Set(None);
                    active_pomodoro_settings.update(self.db).await?;
                }
            }
        };

        Ok(())
    }
}
