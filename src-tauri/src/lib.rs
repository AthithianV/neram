mod commands;

use commands::db::init_db;

use sea_orm::{DatabaseConnection};
use std::sync::Arc;
use tokio::sync::Mutex;

#[derive(Clone)]
struct AppState {
    conn: Arc<Mutex<DatabaseConnection>>,
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub async fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![init_db])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
