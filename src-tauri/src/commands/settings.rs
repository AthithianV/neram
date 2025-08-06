use tauri::{command, State};

use crate::{
    models::settings::ReadSettingsModel, repository::settings::SettingsRepository, AppState,
};

#[command]
pub async fn get_settings(app_state: State<'_, AppState>) -> Result<ReadSettingsModel, String> {
    let db = app_state.conn.lock().await;

    let settings_repository = SettingsRepository::new(&db);
    let result = settings_repository.get().await.map_err(|e| {
        println!("Error creating session: {:?}", e);
        e.to_string()
    });
    result
}
