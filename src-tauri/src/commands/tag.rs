use tauri::{ command, State };

use crate::repository::tag::TagRepository;
use crate::models::tag::{ MiniTag };
use crate::AppState;

// /// Creates a new Tag record in the database.
// ///
// /// This command takes details for a new Tag and inserts it into the 'Tags' table.
// ///
// /// # Arguments
// /// new_tag `TagModel`
// ///
// /// # Returns
// /// A `Result` containing the created `TagModel` on success, or a `String` error message.
// #[command]
// pub async fn create_tag(
//     app_state: State<'_, AppState>,
//     new_tag: TagModel
// ) -> Result<TagModel, String> {
//     // Acquire a lock on the database connection
//     let db = app_state.conn.lock().await;

//     let tag_repository = TagRepository::new(&db);
//     tag_repository.create(&new_tag).await.map_err(|e| e.to_string())
// }

// /// Retrieves all Tag records from the database.
// /// It acquires a lock on the database connection to perform the operation.
// ///
// /// # Arguments
// /// * `app_state` - The Tauri state containing the database connection mutex.
// ///
// /// # Returns
// /// A `Result` containing a `Vec` of `TagModel` on success, or a `String` error message.

#[command]
pub async fn get_all_tags(app_state: State<'_, AppState>) -> Result<Vec<MiniTag>, String> {
    let db = app_state.conn.lock().await;

    let tag_repository = TagRepository::new(&db);
    tag_repository.find_all().await.map_err(|e| e.to_string())
}

// /// Retrieves a single Tag record by its ID.
// /// It acquires a lock on the database connection to perform the operation.
// ///
// /// # Arguments
// /// * `app_state` - The Tauri state containing the database connection mutex.
// /// * `id` - The ID of the Tag to retrieve.
// ///
// /// # Returns
// /// A `Result` containing an `Option<TagModel>` (Some if found, None if not) on success,
// /// or a `String` error message.

// #[command]
// pub async fn get_tag_by_id(
//     app_state: State<'_, AppState>,
//     id: i32
// ) -> Result<Option<TagModel>, String> {
//     // Acquire a lock on the database connection
//     let db = app_state.conn.lock().await;

//     let tag_repository = TagRepository::new(&db);
//     tag_repository.find_by_id(id).await.map_err(|e| e.to_string())
// }

// /// Updates an existing Tag record in the database.
// ///
// /// All fields are optional to allow partial updates. Only provided fields will be updated.
// /// `updated_at` field is automatically set to the current UTC time.
// /// It acquires a lock on the database connection to perform the operation.
// ///
// /// # Arguments
// /// * `app_state` - The Tauri state containing the database connection mutex.
// /// * `tag_to_update` - The tag model to update.
// ///
// /// # Returns
// /// A `Result` containing the updated `TagModel` on success, or a `String` error message.
// #[command]
// pub async fn update_tag(
//     app_state: State<'_, AppState>,
//     tag_to_update: TagModel
// ) -> Result<TagModel, String> {
//     let db = app_state.conn.lock().await;

//     let tag_repository = TagRepository::new(&db);
//     tag_repository.update(&tag_to_update).await.map_err(|e| e.to_string())
// }

// /// Deletes a Tag record by its ID.
// /// It acquires a lock on the database connection to perform the operation.
// ///
// /// # Arguments
// /// * `app_state` - The Tauri state containing the database connection mutex.
// /// * `id` - The ID of the Tag to delete.
// ///
// /// # Returns
// /// A `Result` indicating success (`()`) or a `String` error message.
// #[command]
// pub async fn delete_tag(app_state: State<'_, AppState>, id: i32) -> Result<(), String> {
//     let db = app_state.conn.lock().await;

//     let tag_repository = TagRepository::new(&db);
//     tag_repository.delete(id).await.map_err(|e| e.to_string())?;
//     Ok(())
// }
