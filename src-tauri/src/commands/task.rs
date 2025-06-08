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

use crate::entity::workunit_tag;
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
    status: String,
    priority: Option<String>
) -> Result<task::Model, String> {
    let db = app_state.conn.lock().await;
    let now = Utc::now().fixed_offset();

    let new_task = task::ActiveModel {
        id: Set(Default::default()),
        title: Set(title),
        description: Set(description),
        status: Set(status),
        priority: Set(priority),
        created_at: Set(now),
        updated_at: Set(now),
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
pub async fn get_task_by_id(
    app_state: State<'_, AppState>,
    id: i32
) -> Result<Option<task::Model>, String> {
    let db = app_state.conn.lock().await;
    let task = task::Entity
        ::find_by_id(id)
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
    id: i32,
    title: Option<String>,
    description: Option<String>,
    status: Option<String>,
    priority: Option<String>
) -> Result<Option<task::Model>, String> {
    let db = app_state.conn.lock().await;

    // Find the existing task
    let task = task::Entity
        ::find_by_id(id)
        .one(&*db).await
        .map_err(|e| e.to_string())?
        .ok_or_else(|| format!("Task with ID {} not found", id))?;

    // Convert to ActiveModel to make changes
    let mut task_active_model = task.to_active_model();

    // Update fields if provided
    if let Some(t) = title {
        task_active_model.title = Set(t);
    }
    if let Some(d) = description {
        task_active_model.description = Set(Some(d));
    }
    if let Some(s) = status {
        task_active_model.status = Set(s);
    }
    if let Some(p) = priority {
        task_active_model.priority = Set(Some(p));
    }

    // Update updated_at timestamp
    task_active_model.updated_at = Set(Utc::now().fixed_offset());

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
pub async fn delete_task(app_state: State<'_, AppState>, id: i32) -> Result<(), String> {
    let db = app_state.conn.lock().await;
    let res = task::Entity
        ::delete_by_id(id)
        .exec(&*db).await
        .map_err(|e| e.to_string())?;

    if res.rows_affected == 0 {
        return Err(format!("Task with ID {} not found", id));
    }

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

/// Creates a new workunit record in the database.
///
/// This command takes details for a new workunit and inserts it into the 'workunits' table.
/// `created_at` and `updated_at` fields are automatically set to the current UTC time.
/// It acquires a lock on the database connection to perform the operation.
///
/// # Arguments
/// * `app_state` - The Tauri state containing the database connection mutex.
/// * `title` - Optional title of the workunit.
/// * `description` - Optional description of the workunit.
/// * `task` - The associated task (e.g., its title).
/// * `date` - The date of the workunit (ISO 8601 string, e.g., "2023-10-27T10:00:00Z").
/// * `start_time` - The start time of the workunit (ISO 8601 string).
/// * `end_time` - The end time of the workunit (ISO 8601 string).
/// * `duration` - The duration of the workunit in minutes.
/// * `break_time` - The break time during the workunit in minutes.
///
/// # Returns
/// A `Result` containing the created `WorkunitModel` on success, or a `String` error message.
#[command]
pub async fn create_workunit(
    app_state: State<'_, AppState>,
    title: Option<String>,
    description: Option<String>,
    task: String,
    date: String,
    start_time: String,
    end_time: String,
    session_duration: i32,
    break_duration: i32
) -> Result<workunit::Model, String> {
    // Acquire a lock on the database connection
    let db = app_state.conn.lock().await;

    // Parse DateTimeWithTimeZone strings
    let parsed_date = date
        .parse::<DateTime<Utc>>()
        .map_err(|e| format!("Failed to parse date: {}", e))?
        .fixed_offset();
    let parsed_start_time = start_time
        .parse::<DateTime<Utc>>()
        .map_err(|e| format!("Failed to parse start_time: {}", e))?
        .fixed_offset();
    let parsed_end_time = end_time
        .parse::<DateTime<Utc>>()
        .map_err(|e| format!("Failed to parse end_time: {}", e))?
        .fixed_offset();

    let now = Utc::now().fixed_offset();

    let new_workunit = workunit::ActiveModel {
        // id is primary key and auto-incremented, so we don't set it here for creation.
        id: Set(Default::default()),
        title: Set(title),
        description: Set(description),
        task: Set(task),
        date: Set(parsed_date),
        start_time: Set(parsed_start_time),
        end_time: Set(parsed_end_time),
        session_duration: Set(session_duration),
        break_duration: Set(break_duration),
        created_at: Set(now),
        updated_at: Set(now),
    };

    let res = new_workunit.insert(&*db).await.map_err(|e| e.to_string())?;
    Ok(res)
}

/// Retrieves all workunit records from the database.
/// It acquires a lock on the database connection to perform the operation.
///
/// # Arguments
/// * `app_state` - The Tauri state containing the database connection mutex.
///
/// # Returns
/// A `Result` containing a `Vec` of `WorkunitModel` on success, or a `String` error message.
#[command]
pub async fn get_all_workunits(
    app_state: State<'_, AppState>
) -> Result<Vec<(workunit::Model, Option<task::Model>, Vec<tag::Model>)>, String> {
    let db = app_state.conn.lock().await;
    // First get workunits with their tasks
    let workunits_with_tasks: Vec<(workunit::Model, Vec<task::Model>)> = workunit::Entity
        ::find()
        .find_with_related(task::Entity)
        .all(&*db).await
        .map_err(|e| e.to_string())?;

    // Then get workunits with their tags
    let workunits_with_tags: Vec<(workunit::Model, Vec<tag::Model>)> = workunit::Entity
        ::find()
        .find_with_related(tag::Entity)
        .all(&*db).await
        .map_err(|e| e.to_string())?;

    // Combine the data (you'll need to merge these based on workunit.id)
    use std::collections::HashMap;

    let mut workunit_data: HashMap<
        i32,
        (workunit::Model, Option<task::Model>, Vec<tag::Model>)
    > = HashMap::new();

    // Process tasks
    for (workunit, tasks) in workunits_with_tasks {
        let task = tasks.into_iter().next(); // Should be only one task per workunit
        workunit_data.insert(workunit.id, (workunit, task, Vec::new()));
    }

    // Process tags
    for (workunit, tags) in workunits_with_tags {
        if let Some(entry) = workunit_data.get_mut(&workunit.id) {
            entry.2 = tags;
        }
    }

    let final_result: Vec<(workunit::Model, Option<task::Model>, Vec<tag::Model>)> = workunit_data
        .into_values()
        .collect();

    Ok(final_result)
}

/// Retrieves a single workunit record by its ID.
/// It acquires a lock on the database connection to perform the operation.
///
/// # Arguments
/// * `app_state` - The Tauri state containing the database connection mutex.
/// * `id` - The ID of the workunit to retrieve.
///
/// # Returns
/// A `Result` containing an `Option<WorkunitModel>` (Some if found, None if not) on success,
/// or a `String` error message.
#[command]
pub async fn get_workunit_by_id(
    app_state: State<'_, AppState>,
    id: i32
) -> Result<Option<workunit::Model>, String> {
    // Acquire a lock on the database connection
    let db = app_state.conn.lock().await;
    let workunit = workunit::Entity
        ::find_by_id(id) // Changed WorkunitEntity to Workunit
        .one(&*db).await
        .map_err(|e| e.to_string())?;
    Ok(workunit)
}

/// Updates an existing workunit record in the database.
///
/// All fields are optional to allow partial updates. Only provided fields will be updated.
/// `updated_at` field is automatically set to the current UTC time.
/// It acquires a lock on the database connection to perform the operation.
///
/// # Arguments
/// * `app_state` - The Tauri state containing the database connection mutex.
/// * `id` - The ID of the workunit to update.
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
/// A `Result` containing the updated `WorkunitModel` on success, or a `String` error message.
#[command]
#[allow(clippy::too_many_arguments)] // This is common for update commands
pub async fn update_workunit(
    app_state: State<'_, AppState>,
    id: i32,
    title: Option<String>,
    description: Option<String>,
    task: Option<String>,
    date: Option<String>,
    start_time: Option<String>,
    end_time: Option<String>,
    session_duration: Option<i32>,
    break_duration: Option<i32>
) -> Result<Option<workunit::Model>, String> {
    // Acquire a lock on the database connection
    let db = app_state.conn.lock().await;

    // Find the existing workunit
    let workunit = workunit::Entity
        ::find_by_id(id) // Changed WorkunitEntity to Workunit
        .one(&*db).await
        .map_err(|e| e.to_string())?
        .ok_or_else(|| format!("Workunit with ID {} not found", id))?;

    // Convert to ActiveModel to make changes using the entity method
    let mut workunit_active_model = workunit.to_active_model();

    // Update fields if provided
    if let Some(t) = title {
        workunit_active_model.title = Set(Some(t));
    }
    if let Some(d) = description {
        workunit_active_model.description = Set(Some(d));
    }
    if let Some(t) = task {
        workunit_active_model.task = Set(t);
    }
    if let Some(d) = date {
        let parsed_date = d
            .parse::<DateTime<Utc>>()
            .map_err(|e| format!("Failed to parse date: {}", e))?
            .fixed_offset();
        workunit_active_model.date = Set(parsed_date);
    }
    if let Some(st) = start_time {
        let parsed_start_time = st
            .parse::<DateTime<Utc>>()
            .map_err(|e| format!("Failed to parse start_time: {}", e))?
            .fixed_offset();
        workunit_active_model.start_time = Set(parsed_start_time);
    }
    if let Some(et) = end_time {
        let parsed_end_time = et
            .parse::<DateTime<Utc>>()
            .map_err(|e| format!("Failed to parse end_time: {}", e))?
            .fixed_offset();
        workunit_active_model.end_time = Set(parsed_end_time);
    }
    if let Some(d) = session_duration {
        workunit_active_model.session_duration = Set(d);
    }
    if let Some(b) = break_duration {
        workunit_active_model.break_duration = Set(b);
    }

    // Update updated_at timestamp
    workunit_active_model.updated_at = Set(Utc::now().fixed_offset());

    // Save changes
    let res = workunit_active_model.update(&*db).await.map_err(|e| e.to_string())?;

    Ok(Some(res))
}

/// Deletes a workunit record by its ID.
/// It acquires a lock on the database connection to perform the operation.
///
/// # Arguments
/// * `app_state` - The Tauri state containing the database connection mutex.
/// * `id` - The ID of the workunit to delete.
///
/// # Returns
/// A `Result` indicating success (`()`) or a `String` error message.
#[command]
pub async fn delete_workunit(app_state: State<'_, AppState>, id: i32) -> Result<(), String> {
    // Acquire a lock on the database connection
    let db = app_state.conn.lock().await;
    let res = workunit::Entity
        ::delete_by_id(id) // Changed WorkunitEntity to Workunit
        .exec(&*db).await
        .map_err(|e| e.to_string())?;

    if res.rows_affected == 0 {
        return Err(format!("Workunit with ID {} not found", id));
    }

    Ok(())
}
