use sqlx::{migrate::Migrator, SqlitePool};

static MIGRATOR: Migrator = sqlx::migrate!("./migrations").embed();

use std::{ path::Path, sync::Arc };
use tauri::{ AppHandle, Manager };
use tokio::sync::Mutex;

use crate::AppState;

#[tauri::command]
pub async fn init_db(path: String, app_handle: AppHandle) -> Result<(), String> {
    let db_dir = Path::new(&path);
    if !db_dir.exists() {
        std::fs::create_dir_all(db_dir).map_err(|e| e.to_string())?;
    }

    let db_path = Path::new(&path).join("neram.db");
    let db_exists = db_path.exists();
    let db_url = format!("sqlite://{}/neram.db?mode=rwc", path);
    let pool = SqlitePool::connect(&db_url)        .await
        .expect("Failed to connect to SQLite");

    // Only run migrations if database doesn't exist
    if !db_exists {
        MIGRATOR
        .run(&pool)
        .await
        .expect("Failed to run migrations");

    }

    app_handle.manage(AppState {
        conn: Arc::new(Mutex::new(pool)),
    });

    Ok(())
}