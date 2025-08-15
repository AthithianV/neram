use tauri::{command, State};

use crate::models::task::{CreateTaskModel, ReadTaskModel};
use crate::repository::task::TaskRepository;
use crate::AppState;

// /// Creates a new Task record in the database.
// ///
// /// This command takes details for a new Task and inserts it into the 'Tasks' table.
// ///
// /// # Arguments
// /// new_task `TaskModel`
// ///
// /// # Returns
// /// A `Result` containing the created `TaskModel` on success, or a `String` error message.
#[command]
pub async fn create_task(
    app_state: State<'_, AppState>,
    task_to_create: CreateTaskModel,
) -> Result<(), String> {
    // Acquire a lock on the database connection
    let db = app_state.conn.lock().await;

    let task_repository = TaskRepository::new(&db);
    let _ = task_repository
        .create(&task_to_create)
        .await
        .map_err(|e| e.to_string());
    Ok(())
}

// /// Retrieves all Task records from the database.
// /// It acquires a lock on the database connection to perform the operation.
// ///
// /// # Arguments
// /// * `app_state` - The Tauri state containing the database connection mutex.
// ///
// /// # Returns
// /// A `Result` containing a `Vec` of `TaskModel` on success, or a `String` error message.
#[command]
pub async fn get_all_tasks(
    app_state: State<'_, AppState>,
    project_id: Option<i32>,
    status: Option<String>,
) -> Result<Vec<ReadTaskModel>, String> {
    let db = app_state.conn.lock().await;

    let task_repository = TaskRepository::new(&db);
    task_repository
        .find_all(project_id, status)
        .await
        .map_err(|e| e.to_string())
}

// /// Retrieves a single Task record by its ID.
// /// It acquires a lock on the database connection to perform the operation.
// ///
// /// # Arguments
// /// * `app_state` - The Tauri state containing the database connection mutex.
// /// * `id` - The ID of the Task to retrieve.
// ///
// /// # Returns
// /// A `Result` containing an `Option<TaskModel>` (Some if found, None if not) on success,
// /// or a `String` error message.
#[command]
pub async fn get_task_by_id(
    app_state: State<'_, AppState>,
    task_id: i32,
) -> Result<Option<ReadTaskModel>, String> {
    // Acquire a lock on the database connection
    let db = app_state.conn.lock().await;

    let task_repository = TaskRepository::new(&db);
    task_repository
        .find_by_id(task_id)
        .await
        .map_err(|e| e.to_string())
}

// /// Updates an existing Task record in the database.
// ///
// /// All fields are optional to allow partial updates. Only provided fields will be updated.
// /// `updated_at` field is automatically set to the current UTC time.
// /// It acquires a lock on the database connection to perform the operation.
// ///
// /// # Arguments
// /// * `app_state` - The Tauri state containing the database connection mutex.
// /// * `task_to_update` - The task model to update.
// ///
// /// # Returns
// /// A `Result` containing the updated `TaskModel` on success, or a `String` error message.
#[command]
pub async fn update_task(
    app_state: State<'_, AppState>,
    task_id: i32,
    task_to_update: CreateTaskModel,
) -> Result<(), String> {
    let db = app_state.conn.lock().await;

    let task_repository = TaskRepository::new(&db);
    let _ = task_repository
        .update(task_id, &task_to_update)
        .await
        .map_err(|e| e.to_string());
    Ok(())
}

// /// Deletes a Task record by its ID.
// /// It acquires a lock on the database connection to perform the operation.
// ///
// /// # Arguments
// /// * `app_state` - The Tauri state containing the database connection mutex.
// /// * `id` - The ID of the Task to delete.
// ///
// /// # Returns
// /// A `Result` indicating success (`()`) or a `String` error message.
#[command]
pub async fn delete_task(
    app_state: State<'_, AppState>,
    id: i32,
    should_delete_sessions: bool,
) -> Result<(), String> {
    let db = app_state.conn.lock().await;

    let task_repository = TaskRepository::new(&db);
    task_repository
        .delete(id, should_delete_sessions)
        .await
        .map_err(|e| e.to_string())?;
    Ok(())
}

// /// Add Tag to Task
// ///
// /// # Arguments
// /// * `app_state` - The Tauri state containing the database connection mutex.
// /// * `Task_id` - Id of the sesssion
// /// * `tag_id` - Id of the task
#[command]
pub async fn add_tag_to_task(
    app_state: State<'_, AppState>,
    task_id: i32,
    tag_id: i32,
) -> Result<(), String> {
    let pool = app_state.conn.lock().await;

    let task_repository = TaskRepository::new(&pool);
    task_repository
        .add_tag_to_task(task_id, tag_id)
        .await
        .map_err(|e| e.to_string())
}

// /// Remove Tag from Task
// ///
// /// # Arguments
// /// * `app_state` - The Tauri state containing the database connection mutex.
// /// * `Task_id` - Id of the sesssion
// /// * `tag_id` - Id of the task
#[command]
pub async fn remove_tag_from_task(
    app_state: State<'_, AppState>,
    task_id: i32,
    tag_id: i32,
) -> Result<(), String> {
    let pool = app_state.conn.lock().await;

    let task_repository = TaskRepository::new(&pool);
    task_repository
        .remove_tag_from_task(task_id, tag_id)
        .await
        .map_err(|e| e.to_string())
}
