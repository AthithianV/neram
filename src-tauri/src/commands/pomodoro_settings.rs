use tauri::{command, State};

use crate::models::pomodoro_settings::{ReadPomodoroSettings, UpdatePomodoroSettings};
use crate::repository::pomodoro_settings::PomodoroSettingsRepository;
use crate::AppState;

#[command]
pub async fn update_pomodoro_settings(
    app_state: State<'_, AppState>,
    settings_to_update: UpdatePomodoroSettings,
) -> Result<(), String> {
    // Acquire a lock on the database connection
    let db = app_state.conn.lock().await;

    let pomodoro_settings_repository = PomodoroSettingsRepository::new(&db);
    pomodoro_settings_repository
        .update(settings_to_update)
        .await
        .map_err(|e| e.to_string())
}

#[command]
pub async fn get_pomodoro_settings(
    app_state: State<'_, AppState>,
) -> Result<ReadPomodoroSettings, String> {
    // Acquire a lock on the database connection
    let db = app_state.conn.lock().await;

    let pomodoro_settings_repository = PomodoroSettingsRepository::new(&db);
    pomodoro_settings_repository
        .get()
        .await
        .map_err(|e| e.to_string())
}
