use tauri::{ command, State };

use crate::repository::project::ProjectRepository;
use crate::models::project::{ ProjectModel };
use crate::AppState;

/// Creates a new Project record in the database.
///
/// This command takes details for a new Project and inserts it into the 'Projects' table.
///
/// # Arguments
/// new_project `ProjectModel`
///
/// # Returns
/// A `Result` containing the created `ProjectModel` on success, or a `String` error message.
#[command]
pub async fn create_project(
    app_state: State<'_, AppState>,
    new_project: ProjectModel
) -> Result<ProjectModel, String> {
    // Acquire a lock on the database connection
    let db = app_state.conn.lock().await;

    let project_repository = ProjectRepository::new(&db);
    project_repository.create(&new_project).await.map_err(|e| e.to_string())
}

/// Retrieves all Project records from the database.
/// It acquires a lock on the database connection to perform the operation.
///
/// # Arguments
/// * `app_state` - The Tauri state containing the database connection mutex.
///
/// # Returns
/// A `Result` containing a `Vec` of `ProjectModel` on success, or a `String` error message.

#[command]
pub async fn get_all_projects(app_state: State<'_, AppState>) -> Result<Vec<ProjectModel>, String> {
    let db = app_state.conn.lock().await;

    let project_repository = ProjectRepository::new(&db);
    project_repository.find_all().await.map_err(|e| e.to_string())
}

/// Retrieves a single Project record by its ID.
/// It acquires a lock on the database connection to perform the operation.
///
/// # Arguments
/// * `app_state` - The Tauri state containing the database connection mutex.
/// * `id` - The ID of the Project to retrieve.
///
/// # Returns
/// A `Result` containing an `Option<ProjectModel>` (Some if found, None if not) on success,
/// or a `String` error message.

#[command]
pub async fn get_project_by_id(
    app_state: State<'_, AppState>,
    id: i32
) -> Result<Option<ProjectModel>, String> {
    // Acquire a lock on the database connection
    let db = app_state.conn.lock().await;

    let project_repository = ProjectRepository::new(&db);
    project_repository.find_by_id(id).await.map_err(|e| e.to_string())
}

/// Updates an existing Project record in the database.
///
/// All fields are optional to allow partial updates. Only provided fields will be updated.
/// `updated_at` field is automatically set to the current UTC time.
/// It acquires a lock on the database connection to perform the operation.
///
/// # Arguments
/// * `app_state` - The Tauri state containing the database connection mutex.
/// * `project_to_update` - The project model to update.
///
/// # Returns
/// A `Result` containing the updated `ProjectModel` on success, or a `String` error message.
#[command]
pub async fn update_project(
    app_state: State<'_, AppState>,
    project_to_update: ProjectModel
) -> Result<ProjectModel, String> {
    let db = app_state.conn.lock().await;

    let project_repository = ProjectRepository::new(&db);
    project_repository.update(&project_to_update).await.map_err(|e| e.to_string())
}

/// Deletes a Project record by its ID.
/// It acquires a lock on the database connection to perform the operation.
///
/// # Arguments
/// * `app_state` - The Tauri state containing the database connection mutex.
/// * `id` - The ID of the Project to delete.
///
/// # Returns
/// A `Result` indicating success (`()`) or a `String` error message.
#[command]
pub async fn delete_project(app_state: State<'_, AppState>, id: i32) -> Result<(), String> {
    let db = app_state.conn.lock().await;

    let project_repository = ProjectRepository::new(&db);
    project_repository.delete(id).await.map_err(|e| e.to_string())?;
    Ok(())
}

/// Add Tag to Project
///
/// # Arguments
/// * `app_state` - The Tauri state containing the database connection mutex.
/// * `project_id` - Id of the project
/// * `tag_id` - Id of the tag
#[command]
pub async fn add_tag_to_project(
    app_state: State<'_, AppState>,
    project_id: i32,
    tag_id: i32
) -> Result<(), String> {
    let pool = app_state.conn.lock().await;

    let project_repository = ProjectRepository::new(&pool);
    project_repository.add_tag_to_project(project_id, tag_id).await.map_err(|e| e.to_string())
}

/// Remove Tag from Project
///
/// # Arguments
/// * `app_state` - The Tauri state containing the database connection mutex.
/// * `project_id` - Id of the project
/// * `tag_id` - Id of the tag
#[command]
pub async fn remove_tag_from_project(
    app_state: State<'_, AppState>,
    project_id: i32,
    tag_id: i32
) -> Result<(), String> {
    let pool = app_state.conn.lock().await;

    let project_repository = ProjectRepository::new(&pool);
    project_repository.remove_tag_from_project(project_id, tag_id).await.map_err(|e| e.to_string())
}
