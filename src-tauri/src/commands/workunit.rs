use serde::{ Serialize, Deserialize };
use std::collections::HashMap;
use sea_orm::ConnectionTrait;
use sea_orm::{ ActiveModelTrait, EntityTrait, Set, ColumnTrait, QueryFilter, Statement, NotSet };
use tauri::{ command, State };
use chrono::{ DateTime, Utc };

use crate::entity::workunit;
use crate::entity::task;
use crate::entity::tag;
use crate::entity::workunit_tag;

use crate::AppState;

#[derive(Serialize, Deserialize)]
pub struct WorkunitResponse {
    pub workunit: workunit::Model,
    pub task: Option<task::Model>,
    pub tags: Vec<tag::Model>,
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
    tags: Vec<String>,
    new_workunit: workunit::Model
) -> Result<workunit::Model, String> {
    // Acquire a lock on the database connection
    let db = app_state.conn.lock().await;

    println!("tags: {:?}", tags);
    println!("workunit: {:?}", new_workunit);

    // Parse DateTimeWithTimeZone strings
    let now = Utc::now().fixed_offset();

    let new_workunit_active_model = workunit::ActiveModel {
        id: NotSet,
        title: Set(new_workunit.title),
        description: Set(new_workunit.description),
        task: Set(new_workunit.task),
        date: Set(new_workunit.date),
        start_time: Set(new_workunit.start_time),
        end_time: Set(new_workunit.end_time),
        session_duration: Set(new_workunit.session_duration),
        break_duration: Set(new_workunit.break_duration),
        created_at: Set(Some(now)),
        updated_at: Set(Some(now)),
    };

    let res = new_workunit_active_model.insert(&*db).await.map_err(|e| e.to_string())?;

    if !tags.is_empty() {
        let workunit_tags_active_models: Vec<workunit_tag::ActiveModel> = tags
            .iter()
            .map(|tag| {
                workunit_tag::ActiveModel {
                    workunit_id: Set(res.id),
                    tag: Set(tag.clone()),
                }
            })
            .collect();

        workunit_tag::Entity
            ::insert_many(workunit_tags_active_models)
            .exec(&*db).await
            .map_err(|e| e.to_string())?;
    }

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
) -> Result<Vec<WorkunitResponse>, String> {
    let db = app_state.conn.lock().await;

    let query =
        r#"
        SELECT
            -- Workunit fields
            workunits.id as w_id,
            workunits.task as w_task,
            workunits.date as w_date,
            workunits.title as w_title,
            workunits.description as w_description,
            workunits.start_time as w_start_time,
            workunits.end_time as w_end_time,
            workunits.session_duration as w_session_duration,
            workunits.break_duration as w_break_duration,
            workunits.created_at as w_created_at,
            workunits.updated_at as w_updated_at,
            
            -- Task fields
            tasks.title as t_title,
            tasks.description as t_description,
            tasks.status as t_status,
            tasks.color as t_color,
            tasks.deadline as t_deadline,
            tasks.priority as t_priority,
            tasks.created_at as t_created_at,
            tasks.updated_at as t_updated_at,

            -- Tag fields
            tags.title as tag_title,
            tags.color as tag_color,
            tags.description as tag_description,
            tags.is_default as tag_is_default,
            tags.created_at as tag_created_at,
            tags.updated_at as tag_updated_at
            
        FROM workunits
        LEFT JOIN tasks ON workunits.task = tasks.title
        LEFT JOIN (
            SELECT * FROM tags
            INNER JOIN workunit_tag wt ON wt.tag = tags.title
        ) as tags ON tags.workunit_id = workunits.id
        ORDER BY workunits.date ASC, workunits.id ASC
    "#;

    let rows = db
        .query_all(Statement::from_sql_and_values(db.get_database_backend(), query, [])).await
        .map_err(|e| e.to_string())?;

    // Group data by workunit_id
    let mut workunit_map: HashMap<i32, WorkunitResponse> = HashMap::new();

    for row in rows {
        let workunit_id: i32 = row.try_get_by("w_id").unwrap();

        // Get or create workunit response entry
        let entry = workunit_map.entry(workunit_id).or_insert_with(|| {
            // Parse workunit
            let workunit = workunit::Model {
                id: row.try_get_by("w_id").unwrap(),
                task: row.try_get_by("w_task").unwrap(),
                date: row.try_get_by("w_date").unwrap(),
                title: row.try_get_by("w_title").unwrap(),
                description: row.try_get_by("w_description").unwrap(),
                start_time: row.try_get_by("w_start_time").unwrap(),
                end_time: row.try_get_by("w_end_time").unwrap(),
                session_duration: row.try_get_by("w_session_duration").unwrap(),
                break_duration: row.try_get_by("w_break_duration").unwrap(),
                created_at: row.try_get_by("w_created_at").unwrap(),
                updated_at: row.try_get_by("w_updated_at").unwrap(),
            };

            // Parse task (if exists)
            let task = if row.try_get_by::<String, _>("t_title").is_ok() {
                Some(task::Model {
                    title: row.try_get_by("t_title").unwrap(),
                    description: row.try_get_by("t_description").unwrap(),
                    status: row.try_get_by("t_status").unwrap(),
                    color: row.try_get_by("t_color").unwrap(),
                    deadline: row.try_get_by("t_deadline").unwrap(),
                    priority: row.try_get_by("t_priority").unwrap(),
                    created_at: row.try_get_by("t_created_at").unwrap(),
                    updated_at: row.try_get_by("t_updated_at").unwrap(),
                })
            } else {
                None
            };

            WorkunitResponse {
                workunit,
                task,
                tags: Vec::new(),
            }
        });

        // Add tag if it exists
        if row.try_get_by::<String, _>("tag_title").is_ok() {
            let tag = tag::Model {
                title: row.try_get_by("tag_title").unwrap(),
                color: row.try_get_by("tag_color").unwrap(),
                description: row.try_get_by("tag_description").unwrap(),
                is_default: row.try_get_by("tag_is_default").unwrap(),
                created_at: row.try_get_by("tag_created_at").unwrap(),
                updated_at: row.try_get_by("tag_updated_at").unwrap(),
            };

            // Avoid duplicate tags
            if !entry.tags.iter().any(|t| t.title == tag.title) {
                entry.tags.push(tag);
            }
        }
    }

    // Convert to ordered vector
    let mut result: Vec<WorkunitResponse> = workunit_map.into_values().collect();
    result.sort_by(|a, b| a.workunit.date.cmp(&b.workunit.date));

    Ok(result)
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
) -> Result<Option<(workunit::Model, Vec<tag::Model>)>, String> {
    // Acquire a lock on the database connection
    let db = app_state.conn.lock().await;

    let workunit = workunit::Entity
        ::find()
        .filter(workunit::Column::Id.eq(id))
        .find_with_related(tag::Entity)
        .all(&*db).await
        .map_err(|e| e.to_string())?;

    if let Some((workunit, tags)) = workunit.into_iter().next() {
        Ok(Some((workunit, tags)))
    } else {
        Ok(None)
    }
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
    workunit_to_update: workunit::Model,
    tags: Vec<String>
) -> Result<Option<workunit::Model>, String> {
    // Acquire a lock on the database connection
    let db = app_state.conn.lock().await;

    // Find the existing workunit
    let workunit = workunit::Entity
        ::find_by_id(workunit_to_update.id) // Changed WorkunitEntity to Workunit
        .one(&*db).await
        .map_err(|e| e.to_string())?
        .ok_or_else(|| format!("Workunit with ID {} not found", workunit_to_update.id))?;

    // Convert to ActiveModel to make changes
    let mut workunit_active_model: workunit::ActiveModel = workunit.to_active_model();

    // Update fields if provided
    workunit_active_model.title = Set(workunit_to_update.title);
    workunit_active_model.description = Set(workunit_to_update.description);
    workunit_active_model.task = Set(workunit_to_update.task);
    workunit_active_model.date = Set(workunit_to_update.date);
    workunit_active_model.start_time = Set(workunit_to_update.start_time);
    workunit_active_model.end_time = Set(workunit_to_update.end_time);
    workunit_active_model.session_duration = Set(workunit_to_update.session_duration);
    workunit_active_model.break_duration = Set(workunit_to_update.break_duration);

    // Update updated_at timestamp
    workunit_active_model.updated_at = Set(Some(Utc::now().fixed_offset())); // TODO: Check if this is correct

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

/// Retrieves all workunit records associated with a specific task.
///
/// # Arguments
/// * `app_state` - The Tauri state containing the database connection mutex.
/// * `task_title` - The title of the task to get workunits for.
///
/// # Returns
/// A `Result` containing a `Vec` of `WorkunitModel` on success, or a `String` error message.
#[command]
pub async fn get_workunits_by_task(
    app_state: State<'_, AppState>,
    task_title: String
) -> Result<Vec<workunit::Model>, String> {
    let db = app_state.conn.lock().await;
    let workunits = workunit::Entity
        ::find()
        .filter(workunit::Column::Task.eq(task_title))
        .all(&*db).await
        .map_err(|e| e.to_string())?;
    Ok(workunits)
}
