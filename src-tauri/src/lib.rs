mod commands;
mod entity;

use commands::db::init_db;
use commands::workunit::{
    create_workunit,
    get_all_workunits,
    get_workunit_by_id,
    update_workunit,
    delete_workunit,
};
use commands::task::{ create_task, get_all_tasks, get_task_by_title, update_task, delete_task };
use commands::tag::{
    create_tag,
    get_all_tags,
    get_tag_by_title,
    update_tag,
    delete_tag,
    get_default_tags,
    // get_tags_by_workunit,
    add_tag_to_workunit,
    remove_tag_from_workunit,
};

pub use entity::*;

pub use sea_orm::DatabaseConnection;
use std::sync::Arc;
use tokio::sync::Mutex;

#[derive(Clone)]
struct AppState {
    conn: Arc<Mutex<DatabaseConnection>>,
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub async fn run() {
    tauri::Builder
        ::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(
            tauri::generate_handler![
                init_db,
                create_workunit,
                get_all_workunits,
                get_workunit_by_id,
                update_workunit,
                delete_workunit,
                create_task,
                get_all_tasks,
                get_task_by_title,
                update_task,
                delete_task,
                create_tag,
                get_all_tags,
                get_tag_by_title,
                update_tag,
                delete_tag,
                get_default_tags,
                // get_tags_by_workunit,
                add_tag_to_workunit,
                remove_tag_from_workunit
            ]
        )
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
