mod commands;
mod db;
mod utils;

use commands::pomodoro_settings::*;
use commands::project::*;
use commands::session::*;
use commands::settings::*;
use commands::statistics::*;
use commands::summary::*;
use commands::tag::*;
use commands::task::*;
use commands::timer::*;
use db::lib::init_db;
pub use db::*;
pub use utils::*;

pub use sea_orm::DatabaseConnection;
use std::sync::Arc;
use tokio::sync::Mutex;

#[derive(Clone)]
struct AppState {
    conn: Arc<Mutex<DatabaseConnection>>,
    timer: Arc<Mutex<TimerState>>,
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub async fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .manage(Mutex::new(TimerState::default()))
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![
            // Initialize DB and manage state by adding connection pool to App State
            init_db,
            // session commands
            create_session,
            get_all_sessions,
            get_session_by_id,
            update_session,
            delete_session,
            add_tag_to_session,
            remove_tag_from_session,
            check_session_collision,
            // Task commands
            create_task,
            get_all_tasks,
            get_task_by_id,
            update_task,
            delete_task,
            add_tag_to_task,
            remove_tag_from_task,
            // Project commands
            create_project,
            get_all_projects,
            get_project_by_id,
            update_project,
            delete_project,
            add_tag_to_project,
            remove_tag_from_project,
            // // Tag commands
            create_tag,
            get_all_tags,
            get_tag_by_id,
            update_tag,
            delete_tag,
            // Timer commands
            start_timer,
            stop_timer,
            get_elapsed_time,
            pause_timer,
            resume_timer,
            // Statistics
            get_statistics,
            // Pomodoro
            update_pomodoro_settings,
            get_pomodoro_settings,
            // Settings
            get_settings,
            update_settings,
            // Summary
            get_day_summary,
            get_streaks,
            get_life_time_summary,
            get_monthly_summary
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
