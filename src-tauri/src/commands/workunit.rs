use sea_orm::{ ActiveModelTrait, EntityTrait, Set };
use tauri::{ command, State };
use chrono::{ DateTime, Utc };

use crate::entity::prelude::{ Workunit, WorkunitModel, WorkunitActiveModel };

use crate::AppState;

fn model_to_active_model(model: WorkunitModel) -> WorkunitActiveModel {
    WorkunitActiveModel {
        id: Set(model.id),
        title: Set(model.title),
        description: Set(model.description),
        task: Set(model.task),
        date: Set(model.date),
        start_time: Set(model.start_time),
        end_time: Set(model.end_time),
        session_duration: Set(model.session_duration),
        break_duration: Set(model.break_duration),
        created_at: Set(model.created_at),
        updated_at: Set(model.updated_at),
    }
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
) -> Result<WorkunitModel, String> {
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

    let new_workunit = WorkunitActiveModel {
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
) -> Result<Vec<WorkunitModel>, String> {
    // Acquire a lock on the database connection
    let db = app_state.conn.lock().await;
    let workunits = Workunit::find() // Changed WorkunitEntity to Workunit
        .all(&*db).await
        .map_err(|e| e.to_string())?;
    Ok(workunits)
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
) -> Result<Option<WorkunitModel>, String> {
    // Acquire a lock on the database connection
    let db = app_state.conn.lock().await;
    let workunit = Workunit::find_by_id(id) // Changed WorkunitEntity to Workunit
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
) -> Result<Option<WorkunitModel>, String> {
    // Acquire a lock on the database connection
    let db = app_state.conn.lock().await;

    // Find the existing workunit
    let workunit = Workunit::find_by_id(id) // Changed WorkunitEntity to Workunit
        .one(&*db).await
        .map_err(|e| e.to_string())?
        .ok_or_else(|| format!("Workunit with ID {} not found", id))?;

    // Convert to ActiveModel to make changes
    let mut workunit_active_model: WorkunitActiveModel = model_to_active_model(workunit);

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
    let res = Workunit::delete_by_id(id) // Changed WorkunitEntity to Workunit
        .exec(&*db).await
        .map_err(|e| e.to_string())?;

    if res.rows_affected == 0 {
        return Err(format!("Workunit with ID {} not found", id));
    }

    Ok(())
}
