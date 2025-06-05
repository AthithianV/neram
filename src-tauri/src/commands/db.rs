use sea_orm::{Database};
use std::sync::Arc;
use tokio::sync::Mutex;
use tauri::{AppHandle, Manager};

use crate::AppState;  // Assuming your AppState is in main.rs or lib.rs

#[tauri::command]
pub async fn init_db(path: String, app_handle: AppHandle) -> Result<(), String> {
    let db_url = format!("sqlite://{}", path);
    let conn = Database::connect(&db_url)
        .await
        .map_err(|e| e.to_string())?;

    app_handle.manage(AppState {
        conn: Arc::new(Mutex::new(conn)),
    });

    Ok(())
}
