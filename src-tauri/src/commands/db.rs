use sea_orm::{Database};
use std::sync::Arc;
use tokio::sync::Mutex;
use tauri::{AppHandle, Manager};

use sea_orm::{DatabaseConnection, Schema, ConnectionTrait, DbErr};

use crate::AppState;
use crate::entities;

#[tauri::command]
pub async fn init_db(path: String, app_handle: AppHandle) -> Result<(), String> {
    let db_url = format!("sqlite://{}/neram.db?mode=rwc", path);
    let db = sea_orm::Database::connect(&db_url).await?;

    app_handle.manage(AppState {
        conn: Arc::new(Mutex::new(conn)),
    });

    let schema = Schema::new(db.get_database_backend());

    // Create tables if they don't exist
    db.execute(schema.create_table_from_entity(entities::todos::Entity).if_not_exists()).await?;
    db.execute(schema.create_table_from_entity(entities::tasks::Entity).if_not_exists()).await?;
    db.execute(schema.create_table_from_entity(entities::tags::Entity).if_not_exists()).await?;
    db.execute(schema.create_table_from_entity(entities::workunits::Entity).if_not_exists()).await?;
    db.execute(schema.create_table_from_entity(entities::workunits_tags::Entity).if_not_exists()).await?;
    db.execute(schema.create_table_from_entity(entities::journals::Entity).if_not_exists()).await?;
    db.execute(schema.create_table_from_entity(entities::settings::Entity).if_not_exists()).await?;
    db.execute(schema.create_table_from_entity(entities::pomodaro::Entity).if_not_exists()).await?;
    db.execute(schema.create_table_from_entity(entities::timer::Entity).if_not_exists()).await?;

    Ok(())
}
