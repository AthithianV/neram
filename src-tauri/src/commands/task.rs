use sea_orm::QueryOrder;
use sea_orm::{
    ActiveModelTrait,
    EntityTrait,
    QuerySelect,
    Set,
    JoinType,
    ColumnTrait,
    QueryFilter,
};
use tauri::{ command, State };
use chrono::{ DateTime, Utc };

use crate::entity::workunit;
use crate::entity::task;
use crate::entity::tag;
use crate::entity::task::TodosStatus;

use crate::AppState;

// TASK OPERATIONS

/// Creates a new task record in the database.
///
/// This command takes details for a new task and inserts it into the 'tasks' table.
/// `created_at` and `updated_at` fields are automatically set to the current UTC time.
///
/// # Arguments
/// * `app_state` - The Tauri state containing the database connection mutex.
/// * `title` - The title of the task.
/// * `description` - Optional description of the task.
/// * `status` - The status of the task (e.g., "pending", "in_progress", "completed").
/// * `priority` - Optional priority level of the task.
///
/// # Returns
/// A `Result` containing the created `TaskModel` on success, or a `String` error message.
#[command]
pub async fn create_task(
    app_state: State<'_, AppState>,
    title: String,
    description: Option<String>,
    status: TodosStatus,
    priority: i32,
    deadline: String,
    color: String
) -> Result<task::Model, String> {
    let db = app_state.conn.lock().await;

    let parsed_deadline_date = deadline
        .parse::<DateTime<Utc>>()
        .map_err(|e| format!("Failed to parse date: {}", e))?
        .fixed_offset();
    let now = Utc::now().fixed_offset();

    let new_task = task::ActiveModel {
        title: Set(title),
        description: Set(description),
        status: Set(status),
        priority: Set(priority),
        deadline: Set(parsed_deadline_date),
        color: Set(color),
        created_at: Set(Some(now)),
        updated_at: Set(Some(now)),
    };

    let res = new_task.insert(&*db).await.map_err(|e| e.to_string())?;
    Ok(res)
}

/// Retrieves all task records from the database.
///
/// # Arguments
/// * `app_state` - The Tauri state containing the database connection mutex.
///
/// # Returns
/// A `Result` containing a `Vec` of `TaskModel` on success, or a `String` error message.
#[command]
pub async fn get_all_tasks(app_state: State<'_, AppState>) -> Result<Vec<task::Model>, String> {
    let db = app_state.conn.lock().await;
    let tasks = task::Entity
        ::find()
        .order_by_asc(task::Column::Priority)
        .all(&*db).await
        .map_err(|e| e.to_string())?;
    Ok(tasks)
}

/// Retrieves a single task record by its ID.
///
/// # Arguments
/// * `app_state` - The Tauri state containing the database connection mutex.
/// * `id` - The ID of the task to retrieve.
///
/// # Returns
/// A `Result` containing an `Option<TaskModel>` on success, or a `String` error message.
#[command]
pub async fn get_task_by_title(
    app_state: State<'_, AppState>,
    title: String
) -> Result<Option<task::Model>, String> {
    let db = app_state.conn.lock().await;
    let task = task::Entity
        ::find()
        .filter(task::Column::Title.eq(title))
        .one(&*db).await
        .map_err(|e| e.to_string())?;
    Ok(task)
}

/// Updates an existing task record in the database.
///
/// All fields except ID are optional to allow partial updates.
/// `updated_at` field is automatically set to the current UTC time.
///
/// # Arguments
/// * `app_state` - The Tauri state containing the database connection mutex.
/// * `id` - The ID of the task to update.
/// * `title` - Optional new title.
/// * `description` - Optional new description.
/// * `status` - Optional new status.
/// * `priority` - Optional new priority.
///
/// # Returns
/// A `Result` containing the updated `TaskModel` on success, or a `String` error message.
#[command]
pub async fn update_task(
    app_state: State<'_, AppState>,
    title: String,
    description: Option<String>,
    status: TodosStatus,
    priority: i32,
    deadline: String,
    color: String
) -> Result<Option<task::Model>, String> {
    let db = app_state.conn.lock().await;

    // Find the existing task
    let task = task::Entity
        ::find()
        .filter(task::Column::Title.eq(title.clone()))
        .one(&*db).await
        .map_err(|e| e.to_string())?
        .ok_or_else(|| format!("Task with title {} not found", title.clone()))?;

    // Convert to ActiveModel to make changes
    let mut task_active_model = task.to_active_model();

    let parsed_deadline_date = deadline
        .parse::<DateTime<Utc>>()
        .map_err(|e| format!("Failed to parse date: {}", e))?
        .fixed_offset();

    // Update fields if provided
    task_active_model.title = Set(title);
    task_active_model.description = Set(description);
    task_active_model.status = Set(status);
    task_active_model.priority = Set(priority);
    task_active_model.deadline = Set(parsed_deadline_date);
    task_active_model.color = Set(color);

    // Update timestamp
    let now = Utc::now().fixed_offset();
    task_active_model.updated_at = Set(Some(now));

    // Save changes
    let res = task_active_model.update(&*db).await.map_err(|e| e.to_string())?;
    Ok(Some(res))
}

/// Deletes a task record by its ID.
///
/// # Arguments
/// * `app_state` - The Tauri state containing the database connection mutex.
/// * `id` - The ID of the task to delete.
///
/// # Returns
/// A `Result` indicating success (`()`) or a `String` error message.
#[command]
pub async fn delete_task(app_state: State<'_, AppState>, title: String) -> Result<(), String> {
    let db = app_state.conn.lock().await;
    task::Entity
        ::delete_many()
        .filter(task::Column::Title.eq(title.clone()))
        .exec(&*db).await
        .map_err(|e| e.to_string())?;

    Ok(())
}

/// Calculates the total session duration for all workunits associated with a specific task.
///
/// # Arguments
/// * `app_state` - The Tauri state containing the database connection mutex.
/// * `task_title` - The title of the task to calculate total duration for.
///
/// # Returns
/// A `Result` containing the total duration in minutes as `i32`, or a `String` error message.
#[command]
pub async fn get_total_duration_by_task(
    app_state: State<'_, AppState>,
    task_title: String
) -> Result<i32, String> {
    let db = app_state.conn.lock().await;
    let workunits = workunit::Entity
        ::find()
        .filter(workunit::Column::Task.eq(task_title))
        .all(&*db).await
        .map_err(|e| e.to_string())?;

    let total_duration: i32 = workunits
        .iter()
        .map(|w| w.session_duration)
        .sum();
    Ok(total_duration)
}
