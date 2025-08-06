use tauri::{command, State};

use crate::{
    models::settings::{ReadSettingsModel, UpdateSettingsModel},
    repository::settings::SettingsRepository,
    AppState,
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

#[command]
pub async fn update_settings(
    app_state: State<'_, AppState>,
    settings_to_update: UpdateSettingsModel,
) -> Result<(), String> {
    let db = app_state.conn.lock().await;

    let settings_repository = SettingsRepository::new(&db);
    settings_repository
        .update(settings_to_update)
        .await
        .map_err(|e| {
            println!("Error creating session: {:?}", e);
            e.to_string()
        })
}
