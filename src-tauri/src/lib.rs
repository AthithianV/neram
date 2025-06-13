mod db;
mod commands;
mod entity;

use commands::db::init_db;
use commands::workunit::*;
use commands::task::*;
use commands::tag::*;
use commands::timer::*;

pub use entity::*;
pub use db::*;
use sqlx::{Pool, Sqlite};

use std::sync::Arc;
use tokio::sync::Mutex;

#[derive(Clone)]
struct AppState {
    conn: Arc<Mutex<Pool<Sqlite>>>
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub async fn run() {
    tauri::Builder
        ::default()
        .manage(Mutex::new(TimerState::default()))
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(
            tauri::generate_handler![
                // Initialize DB and manage state by adding connection pool to App State
                init_db,

                // Workunit commands
                create_workunit,
                get_all_workunits,
                get_workunit_by_id,
                update_workunit,
                delete_workunit,

                // Task commands
                create_task,
                get_all_tasks,
                get_task_by_title,
                update_task,
                delete_task,

                // Tag commands
                create_tag,
                get_all_tags,
                get_tag_by_title,
                update_tag,
                delete_tag,
                get_default_tags,
                // get_tags_by_workunit,
                add_tag_to_workunit,
                remove_tag_from_workunit,

                // Timer commands
                start_timer,
                stop_timer,
                get_elapsed_time,
                reset_timer
            ]
        )
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
