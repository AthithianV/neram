use sqlx::{ migrate::Migrator, SqlitePool };

use std::{ path::Path, sync::Arc };
use tauri::{ AppHandle, Manager };
use tokio::sync::Mutex;

use crate::AppState;

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

    let pool = SqlitePool::connect(&db_url).await.expect("Failed to connect to SQLite");

    // Add this before creating the migrator
    println!("Current working directory: {:?}", std::env::current_dir());
    println!("Checking if ./migrations exists: {}", Path::new("./migrations").exists());

    // List contents of current directory
    if let Ok(entries) = std::fs::read_dir(".") {
        println!("Current directory contents:");
        for entry in entries {
            if let Ok(entry) = entry {
                println!("  {:?}", entry.path());
            }
        }
    }

    // Only run migrations if database doesn't exist
    if !db_exists {
        println!("Database doesn't exist, running migrations...");
        let migrator = Migrator::new(Path::new("./migrations")).await.unwrap();
        match migrator.run(&pool).await {
            Ok(_) => println!("Migrations completed successfully"),
            Err(e) => {
                println!("Migration error: {:?}", e);
                return Err(e.to_string());
            }
        }
    } else {
        println!("Database exists, skipping migrations");
    }

    println!("Setting up app state with database connection");
    app_handle.manage(AppState {
        conn: Arc::new(Mutex::new(pool)),
    });

    println!("Database initialization completed");
    Ok(())
}
