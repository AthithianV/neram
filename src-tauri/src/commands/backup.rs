use migration::{Migrator, MigratorTrait};
use sea_orm::{Database, DatabaseConnection};
use std::fs;
use std::path::Path;
use tauri::AppHandle;
use tauri_plugin_dialog::DialogExt;
use tauri_plugin_fs::FilePath;
use chrono::Local;

#[tauri::command]
pub fn backup_db(path: String, app: AppHandle) -> Result<(), String> {
    let app_dir = Path::new(&path);
    if !app_dir.exists() {
        println!("Creating database directory at: {:?}", app_dir);
        std::fs::create_dir_all(app_dir).map_err(|e| e.to_string())?;
    }

    let db_path = Path::new(&path).join("neram.db");
    if !db_path.exists() {
        return Err("Database file not found".into());
    }

    if let Some(save_dialog) = app
        .dialog()
        .file()
        .add_filter("SQLite Database", &["sqlite", "db"])
        .blocking_save_file()
    {
        match save_dialog {
            FilePath::Path(save_path) => {
                fs::copy(&db_path, &save_path).map_err(|e| e.to_string())?;
                Ok(())
            }
            FilePath::Url(url) => Err(format!("Got a URL instead of a file path: {}", url)),
        }
    } else {
        Err("Save canceled".into())
    }
}

#[tauri::command]
pub async fn restore_db(path: String, app: AppHandle) -> Result<(), String> {
    let app_dir = Path::new(&path);
    if !app_dir.exists() {
        std::fs::create_dir_all(app_dir).map_err(|e| e.to_string())?;
    }

    let db_path = app_dir.join("neram.db");

    // Step 1: Ask user for a sqlite file
    let file_dialog = app
        .dialog()
        .file()
        .add_filter("SQLite Database", &["sqlite", "db"])
        .blocking_pick_file();

    let restore_file = match file_dialog {
        Some(FilePath::Path(path)) => path,
        Some(FilePath::Url(url)) => {
            return Err(format!("Got a URL instead of a file path: {}", url))
        }
        None => return Err("Restore canceled".into()),
    };

    // Step 2: Try connecting to the restore db
    let conn_str = format!("sqlite://{}", restore_file.display());
    let db: DatabaseConnection = Database::connect(&conn_str)
        .await
        .map_err(|e| format!("Failed to connect to database: {}", e))?;

    // Step 3: Validate migrations (attempt to migrate up)
    if let Err(e) = Migrator::up(&db, None).await {
        return Err(format!("Database schema validation failed: {}", e));
    }

    // Step 4: Backup current db before overwrite (safety)
    if db_path.exists() {
        let timestamp = Local::now().format("%Y%m%d_%H%M%S");
            let file_stem = db_path.file_stem().unwrap().to_string_lossy();
            let parent = db_path.parent().unwrap();

            let backup_name = format!("{}_{}.db", file_stem, timestamp);
            let backup_path = parent.join(backup_name);

            fs::copy(&db_path, &backup_path).map_err(|e| e.to_string())?;
    }

    // Step 5: Replace current db with restore file
    fs::copy(&restore_file, &db_path).map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
pub async fn reset_db(path: String, app: AppHandle) -> Result<(), String> {
    let app_dir = Path::new(&path);
    if !app_dir.exists() {
        std::fs::create_dir_all(app_dir).map_err(|e| e.to_string())?;
    }


    // Create New Sqlite File and Migrate the default data.
    let new_db_path = Path::new(&path).join("new_neram.db");
    let new_db_url = format!("sqlite://{}/new_neram.db?mode=rwc", path);
    let new_db_connection: DatabaseConnection = Database::connect(&new_db_url)
        .await
        .map_err(|e| format!("Failed to connect to database: {}", e))?;
    match Migrator::up(&new_db_connection, None).await {
        Ok(_) => println!("Initial migrations completed successfully"),
        Err(e) => {
            println!("Migration error: {:?}", e);
            return Err(format!("Migration failed: {}", e));
        }
    }


    // Back Up current DB.
    let db_path = app_dir.join("neram.db");
    if db_path.exists() {
        let timestamp = Local::now().format("%Y%m%d_%H%M%S");
            let file_stem = db_path.file_stem().unwrap().to_string_lossy();
            let parent = db_path.parent().unwrap();

            let backup_name = format!("{}_{}.db", file_stem, timestamp);
            let backup_path = parent.join(backup_name);

            fs::copy(&db_path, &backup_path).map_err(|e| e.to_string())?;
    }

    // Replace current db with restore file
    fs::copy(&new_db_path, &db_path).map_err(|e| e.to_string())?;

    let _ = fs::remove_file(&new_db_path);

    Ok(())
}
