mod entities;

use entities::*;
use sea_orm::{Database, DatabaseConnection, EntityTrait, Set};
use tauri::Manager;
use std::sync::Arc;
use tokio::sync::Mutex;

#[derive(Clone)]
struct AppState {
    conn: Arc<Mutex<DatabaseConnection>>,
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {

        let conn = Database::connect("sqlite://data.db")
        .expect("Failed to connect to database");

    tauri::Builder::default()
        .manage(AppState {
            conn: Arc::new(Mutex::new(conn)),
        })
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
