use sea_orm::{ Database, DatabaseConnection };
use migration::{ Migrator, MigratorTrait };
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

    let db: DatabaseConnection = Database::connect(&db_url).await.map_err(|e|
        format!("Failed to connect to database: {}", e)
    )?;

    // Run migrations
    println!("Running SeaORM migrations...");
    match Migrator::up(&db, None).await {
        Ok(_) => println!("SeaORM migrations completed successfully"),
        Err(e) => {
            println!("Migration error: {:?}", e);
            return Err(format!("Migration failed: {}", e));
        }
    }

    println!("Setting up app state with database connection");
    app_handle.manage(AppState {
        conn: Arc::new(Mutex::new(db)),
    });

    println!("Database initialization completed");
    Ok(())
}
