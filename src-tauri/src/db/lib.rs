use migration::{Migrator, MigratorTrait};
use sea_orm::{Database, DatabaseConnection};
use std::{path::Path, sync::Arc};
use tauri::{AppHandle, Manager};
use tokio::sync::Mutex;

use crate::{commands::timer::TimerState, AppState};

#[tauri::command]
pub async fn init_db(path: String, app_handle: AppHandle) -> Result<(), String> {
    println!("Initializing database at path: {}", path);

    let db_dir = Path::new(&path);
    if !db_dir.exists() {
        println!("Creating database directory at: {:?}", db_dir);
        std::fs::create_dir_all(db_dir).map_err(|e| e.to_string())?;
    }

    let db_path = Path::new(&path).join("neram.db");
    let db_exists = db_path.exists();
    println!("Database exists: {}", db_exists);

    let db_url = format!("sqlite://{}/neram.db?mode=rwc", path);
    println!("Connecting to database with URL: {}", db_url);

    let db: DatabaseConnection = Database::connect(&db_url)
        .await
        .map_err(|e| format!("Failed to connect to database: {}", e))?;

    // Only run migrations if database doesn't exist or has pending migrations
    if !db_exists {
        println!("New database detected, running initial migrations...");
        match Migrator::up(&db, None).await {
            Ok(_) => println!("Initial migrations completed successfully"),
            Err(e) => {
                println!("Migration error: {:?}", e);
                return Err(format!("Migration failed: {}", e));
            }
        }
    } else {
        // Check if there are pending migrations
        match Migrator::get_pending_migrations(&db).await {
            Ok(pending) => {
                if !pending.is_empty() {
                    println!(
                        "Found {} pending migrations, running them...",
                        pending.len()
                    );
                    match Migrator::up(&db, None).await {
                        Ok(_) => println!("Pending migrations completed successfully"),
                        Err(e) => {
                            println!("Migration error: {:?}", e);
                            return Err(format!("Migration failed: {}", e));
                        }
                    }
                } else {
                    println!("Database is up to date, no migrations needed");
                }
            }
            Err(e) => {
                println!("Error checking pending migrations: {:?}", e);
                return Err(format!("Failed to check pending migrations: {}", e));
            }
        }
    }

    println!("Setting up app state with database connection");
    app_handle.manage(AppState {
        conn: Arc::new(Mutex::new(db)),
        timer: Arc::new(Mutex::new(TimerState::default())),
    });

    println!("Database initialization completed");
    Ok(())
}
