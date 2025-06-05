use sea_orm::{Database};
use std::sync::Arc;
use tokio::sync::Mutex;
use tauri::{AppHandle, Manager};


use crate::AppState;

#[tauri::command]
pub async fn init_db(path: String, app_handle: AppHandle) -> Result<(), String> {
    let db_url = format!("sqlite://{}/neram.db?mode=rwc", path);
    let conn = Database::connect(&db_url).await.unwrap();

    app_handle.manage(AppState {
        conn: Arc::new(Mutex::new(conn)),
    });

    Ok(())
}
