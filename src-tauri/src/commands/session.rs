use tauri::{ command, State };

use crate::repository::session::SessionRepository;
use crate::models::session::{ SessioWithRelation, SessionModel };
use crate::AppState;

/// Creates a new session record in the database.
///
/// This command takes details for a new session and inserts it into the 'sessions' table.
///
/// # Arguments
/// new_session `SessionModel`
/// tag_ids `Vec<i32>`
///
/// # Returns
/// A `Result` containing the created `SessionModel` on success, or a `String` error message.
#[command]
pub async fn create_session(
    app_state: State<'_, AppState>,
    new_session: SessionModel,
    tag_ids: Vec<u32>
) -> Result<(), String> {
    // Acquire a lock on the database connection
    let pool = app_state.conn.lock().await;

    let session_repository = SessionRepository::new(&pool);
    session_repository.create(&new_session, tag_ids).await.map_err(|e| e.to_string())
}

/// Retrieves all session records from the database.
/// It acquires a lock on the database connection to perform the operation.
///
/// # Arguments
/// * `app_state` - The Tauri state containing the database connection mutex.
///
/// # Returns
/// A `Result` containing a `Vec` of `SessionWithRelation` on success, or a `String` error message.

#[command]
pub async fn get_all_sessions(
    app_state: State<'_, AppState>
) -> Result<Vec<SessioWithRelation>, String> {
    let pool = app_state.conn.lock().await;

    let session_repository = SessionRepository::new(&pool);
    session_repository.find_all().await.map_err(|e| e.to_string())
}

/// Retrieves a single session record by its ID.
/// It acquires a lock on the database connection to perform the operation.
///
/// # Arguments
/// * `app_state` - The Tauri state containing the database connection mutex.
/// * `id` - The ID of the session to retrieve.
///
/// # Returns
/// A `Result` containing an `Option<sessionModel>` (Some if found, None if not) on success,
/// or a `String` error message.

#[command]
pub async fn get_session_by_id(
    app_state: State<'_, AppState>,
    id: u32
) -> Result<Option<SessioWithRelation>, String> {
    // Acquire a lock on the database connection
    let pool = app_state.conn.lock().await;

    let session_repository = SessionRepository::new(&pool);
    session_repository.find_by_id(id).await.map_err(|e| e.to_string())
}

/// Updates an existing session record in the database.
///
/// All fields are optional to allow partial updates. Only provided fields will be updated.
/// `updated_at` field is automatically set to the current UTC time.
/// It acquires a lock on the database connection to perform the operation.
///
/// # Arguments
/// * `app_state` - The Tauri state containing the database connection mutex.
/// * `id` - The ID of the session to update.
/// * `title` - Optional new title.
/// * `description` - Optional new description.
/// * `task` - Optional new task.
/// * `date` - Optional new date (ISO 8601 string).
/// * `start_time` - Optional new start time (ISO 8601 string).
/// * `end_time` - Optional new end time (ISO 8601 string).
/// * `duration` - Optional new duration.
/// * `break_time` - Optional new break time.
///
/// # Returns
/// A `Result` containing the updated `sessionModel` on success, or a `String` error message.
#[command]
#[allow(clippy::too_many_arguments)] // This is common for update commands
pub async fn update_session(
    app_state: State<'_, AppState>,
    session_to_update: SessionModel
) -> Result<(), String> {
    let pool = app_state.conn.lock().await;

    let session_repository = SessionRepository::new(&pool);
    session_repository.update(&session_to_update).await.map_err(|e| e.to_string())
}

/// Deletes a session record by its ID.
/// It acquires a lock on the database connection to perform the operation.
///
/// # Arguments
/// * `app_state` - The Tauri state containing the database connection mutex.
/// * `id` - The ID of the session to delete.
///
/// # Returns
/// A `Result` indicating success (`()`) or a `String` error message.
#[command]
pub async fn delete_session(app_state: State<'_, AppState>, id: u32) -> Result<(), String> {
    let pool = app_state.conn.lock().await;

    let session_repository = SessionRepository::new(&pool);
    session_repository.delete(id).await.map_err(|e| e.to_string())
}

/// Add Tag to session
///
/// # Arguments
/// * `app_state` - The Tauri state containing the database connection mutex.
/// * `session_id` - Id of the sesssion
/// * `tag_id` - Id of the task
#[command]
pub async fn add_tag_to_session(
    app_state: State<'_, AppState>,
    session_id: u32,
    tag_id: u32
) -> Result<(), String> {
    let pool = app_state.conn.lock().await;

    let session_repository = SessionRepository::new(&pool);
    session_repository.add_tag_to_session(session_id, tag_id).await.map_err(|e| e.to_string())
}

/// Remove Tag from session
///
/// # Arguments
/// * `app_state` - The Tauri state containing the database connection mutex.
/// * `session_id` - Id of the sesssion
/// * `tag_id` - Id of the task
#[command]
pub async fn remove_tag_from_session(
    app_state: State<'_, AppState>,
    session_id: u32,
    tag_id: u32
) -> Result<(), String> {
    let pool = app_state.conn.lock().await;

    let session_repository = SessionRepository::new(&pool);
    session_repository.remove_tag_from_session(session_id, tag_id).await.map_err(|e| e.to_string())
}
