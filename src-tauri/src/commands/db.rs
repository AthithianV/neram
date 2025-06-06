use sea_orm::Database;
use std::sync::Arc;
use tauri::{AppHandle, Manager};
use tokio::sync::Mutex;
use super::migrate::setup_db;

use crate::AppState;

#[tauri::command]
pub async fn init_db(path: String, app_handle: AppHandle) -> Result<(), String> {
    let db_url = format!("sqlite://{}/neram.db?mode=rwc", path);
    let conn = Database::connect(&db_url).await.unwrap();

    setup_db(&db_url);

    app_handle.manage(AppState {
        conn: Arc::new(Mutex::new(conn)),
    });

    Ok(())
}
