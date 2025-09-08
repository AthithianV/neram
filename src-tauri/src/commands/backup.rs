use std::fs;
use std::path::Path;
use tauri::AppHandle;
use tauri_plugin_dialog::DialogExt;
use tauri_plugin_fs::FilePath;

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
