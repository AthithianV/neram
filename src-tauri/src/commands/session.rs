use tauri::{command, State};

use crate::models::session::{
    CreateSessionModel, FullSessionModel, GroupedSessions, SessionGroupType, UpdateSessionModel,
};
use crate::repository::session::SessionRepository;
use crate::AppState;

/// Creates a new session record in the database.
///
/// This command takes details for a new session and inserts it into the 'sessions' table.
///
/// # Arguments
/// new_session `SessionModel`
///
/// # Returns
/// A `Result` containing the created `SessionModel` on success, or a `String` error message.
#[command]
pub async fn create_session(
    app_state: State<'_, AppState>,
    new_session: CreateSessionModel,
) -> Result<i32, String> {
    let db = app_state.conn.lock().await;

    let session_repository = SessionRepository::new(&db);
    let session = session_repository.create(&new_session).await.map_err(|e| {
        println!("Error creating session: {:?}", e);
        e.to_string()
    });
    Ok(session.unwrap().id)
}

/// Retrieves all session records from the database.
/// It acquires a lock on the database connection to perform the operation.
///
/// # Arguments
/// * `app_state` - The Tauri state containing the database connection mutex.
///
/// # Returns
/// A `Result` containing a `Vec` of `SessionModel` on success, or a `String` error message.
#[command]
pub async fn get_all_sessions(
    app_state: State<'_, AppState>,
    group_by: SessionGroupType,
) -> Result<Vec<GroupedSessions>, String> {
    let db = app_state.conn.lock().await;

    let session_repository = SessionRepository::new(&db);
    session_repository
        .find_all(group_by)
        .await
        .map_err(|e| e.to_string())
}

/// Retrieves a single session record by its ID.
/// It acquires a lock on the database connection to perform the operation.
///
/// # Arguments
/// * `app_state` - The Tauri state containing the database connection mutex.
/// * `id` - The ID of the session to retrieve.
///
/// # Returns
/// A `Result` containing an `Option<SessionModel>` (Some if found, None if not) on success,
/// or a `String` error message.
#[command]
pub async fn get_session_by_id(
    app_state: State<'_, AppState>,
    id: i32,
) -> Result<Option<FullSessionModel>, String> {
    // Acquire a lock on the database connection
    let db = app_state.conn.lock().await;

    let session_repository = SessionRepository::new(&db);
    session_repository
        .find_by_id(id)
        .await
        .map_err(|e| e.to_string())
}

/// Updates an existing session record in the database.
///
/// All fields are optional to allow partial updates. Only provided fields will be updated.
/// `updated_at` field is automatically set to the current UTC time.
/// It acquires a lock on the database connection to perform the operation.
///
/// # Arguments
/// * `app_state` - The Tauri state containing the database connection mutex.
/// * `session_to_update` - The session model to update.
///
/// # Returns
/// A `Result` containing the updated `SessionModel` on success, or a `String` error message.
#[command]
pub async fn update_session(
    app_state: State<'_, AppState>,
    session_to_update: UpdateSessionModel,
    session_id: i32,
) -> Result<(), String> {
    let db = app_state.conn.lock().await;

    let session_repository = SessionRepository::new(&db);
    let _ = session_repository
        .update(&session_to_update, session_id)
        .await
        .map_err(|e| e.to_string());
    Ok(())
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
pub async fn delete_session(app_state: State<'_, AppState>, id: i32) -> Result<(), String> {
    let db = app_state.conn.lock().await;

    let session_repository = SessionRepository::new(&db);
    session_repository
        .delete(id)
        .await
        .map_err(|e| e.to_string())?;
    Ok(())
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
    session_id: i32,
    tag_id: i32,
) -> Result<(), String> {
    let pool = app_state.conn.lock().await;

    let session_repository = SessionRepository::new(&pool);
    session_repository
        .add_tag_to_session(session_id, tag_id)
        .await
        .map_err(|e| e.to_string())
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
    session_id: i32,
    tag_id: i32,
) -> Result<(), String> {
    let pool = app_state.conn.lock().await;

    let session_repository = SessionRepository::new(&pool);
    session_repository
        .remove_tag_from_session(session_id, tag_id)
        .await
        .map_err(|e| e.to_string())
}

/// Check if session collides with another session on the same day
///
/// # Arguments
/// * `app_state` - The Tauri state containing the database connection mutex.
/// * `session_id` - Id of the sesssion
/// * `start_time` - Start time of the session
/// * `end_time` - End time of the session
/// * `date` - Date of the session
#[command]
pub async fn check_session_collision(
    app_state: State<'_, AppState>,
    start_time: i64,
    end_time: Option<i64>,
    session_id: i32,
) -> Result<bool, String> {
    let pool = app_state.conn.lock().await;

    let session_repository = SessionRepository::new(&pool);
    session_repository
        .collides_on_day(start_time, end_time, session_id)
        .await
        .map_err(|e| e.to_string())
}

/// Check whether latest session has end time, if not updates it.
///
/// # Arguments
/// * `app_state` - The Tauri state containing the database connection mutex.
#[command]
pub async fn update_incomplete_session(app_state: State<'_, AppState>) -> Result<(), String> {
    let pool = app_state.conn.lock().await;

    let session_repository = SessionRepository::new(&pool);
    session_repository
        .update_incomplete_session()
        .await
        .map_err(|e| e.to_string())
}
