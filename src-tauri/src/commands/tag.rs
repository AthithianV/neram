// use sea_orm::QueryOrder;
// use sea_orm::{
//     ActiveModelTrait,
//     EntityTrait,
//     QuerySelect,
//     Set,
//     JoinType,
//     ColumnTrait,
//     QueryFilter,
//     NotSet,
// };
// use tauri::{ command, State };
// use chrono::{ DateTime, Utc };

// use crate::entity::workunit;
// use crate::entity::workunit_tag;
// use crate::entity::tag;

// use crate::AppState;

// // TAG OPERATIONS

// /// Creates a new tag record in the database.
// ///
// /// This command takes details for a new tag and inserts it into the 'tags' table.
// /// `created_at` and `updated_at` fields are automatically set to the current UTC time.
// ///
// /// # Arguments
// /// * `app_state` - The Tauri state containing the database connection mutex.
// /// * `title` - The title of the tag.
// /// * `description` - Optional description of the tag.
// /// * `color` - Optional color of the tag.
// /// * `is_default` - Whether this is a default tag.
// ///
// /// # Returns
// /// A `Result` containing the created `TagModel` on success, or a `String` error message.
// #[command]
// pub async fn create_tag(
//     app_state: State<'_, AppState>,
//     new_tag: tag::Model
// ) -> Result<tag::Model, String> {
//     let db = app_state.conn.lock().await;

//     let now = Utc::now().fixed_offset();

//     let new_tag_active_model = tag::ActiveModel {
//         title: NotSet,
//         description: Set(new_tag.description),
//         color: Set(new_tag.color),
//         is_default: Set(new_tag.is_default),
//         created_at: Set(Some(now)),
//         updated_at: Set(Some(now)),
//     };

//     let res = new_tag_active_model.insert(&*db).await.map_err(|e| e.to_string())?;
//     Ok(res)
// }

// /// Retrieves all tag records from the database.
// ///
// /// # Arguments
// /// * `app_state` - The Tauri state containing the database connection mutex.
// ///
// /// # Returns
// /// A `Result` containing a `Vec` of `TagModel` on success, or a `String` error message.
// #[command]
// pub async fn get_all_tags(app_state: State<'_, AppState>) -> Result<Vec<tag::Model>, String> {
//     let db = app_state.conn.lock().await;
//     let tags = tag::Entity
//         ::find()
//         .order_by_asc(tag::Column::Title)
//         .all(&*db).await
//         .map_err(|e| e.to_string())?;
//     Ok(tags)
// }

// /// Retrieves a single tag record by its title.
// ///
// /// # Arguments
// /// * `app_state` - The Tauri state containing the database connection mutex.
// /// * `title` - The title of the tag to retrieve.
// ///
// /// # Returns
// /// A `Result` containing an `Option<TagModel>` on success, or a `String` error message.
// #[command]
// pub async fn get_tag_by_title(
//     app_state: State<'_, AppState>,
//     title: String
// ) -> Result<Option<tag::Model>, String> {
//     let db = app_state.conn.lock().await;
//     let tag = tag::Entity
//         ::find()
//         .filter(tag::Column::Title.eq(title))
//         .one(&*db).await
//         .map_err(|e| e.to_string())?;
//     Ok(tag)
// }

// /// Updates an existing tag record in the database.
// ///
// /// All fields except title are optional to allow partial updates.
// /// `updated_at` field is automatically set to the current UTC time.
// ///
// /// # Arguments
// /// * `app_state` - The Tauri state containing the database connection mutex.
// /// * `title` - The title of the tag to update.
// /// * `description` - Optional new description.
// /// * `color` - Optional new color.
// /// * `is_default` - Optional new is_default value.
// ///
// /// # Returns
// /// A `Result` containing the updated `TagModel` on success, or a `String` error message.
// #[command]
// pub async fn update_tag(
//     app_state: State<'_, AppState>,
//     title: String,
//     description: Option<String>,
//     color: String,
//     is_default: bool
// ) -> Result<Option<tag::Model>, String> {
//     let db = app_state.conn.lock().await;

//     // Find the existing tag
//     let tag = tag::Entity
//         ::find()
//         .filter(tag::Column::Title.eq(title.clone()))
//         .one(&*db).await
//         .map_err(|e| e.to_string())?
//         .ok_or_else(|| format!("Tag with title {} not found", title.clone()))?;

//     // Convert to ActiveModel to make changes
//     let mut tag_active_model = tag.to_active_model();

//     // Update fields if provided
//     if let Some(d) = description {
//         tag_active_model.description = Set(Some(d));
//     }

//     tag_active_model.color = Set(color);

//     tag_active_model.is_default = Set(is_default);

//     // Update timestamp
//     tag_active_model.updated_at = Set(Some(Utc::now().fixed_offset()));

//     // Save changes
//     let res = tag_active_model.update(&*db).await.map_err(|e| e.to_string())?;
//     Ok(Some(res))
// }

// /// Deletes a tag record by its title.
// ///
// /// # Arguments
// /// * `app_state` - The Tauri state containing the database connection mutex.
// /// * `title` - The title of the tag to delete.
// ///
// /// # Returns
// /// A `Result` indicating success (`()`) or a `String` error message.
// #[command]
// pub async fn delete_tag(app_state: State<'_, AppState>, title: String) -> Result<(), String> {
//     let db = app_state.conn.lock().await;

//     // First delete all workunit_tag relationships for this tag
//     workunit_tag::Entity
//         ::delete_many()
//         .filter(workunit_tag::Column::Tag.eq(title.clone()))
//         .exec(&*db).await
//         .map_err(|e| e.to_string())?;

//     // Then delete the tag
//     tag::Entity
//         ::delete_many()
//         .filter(tag::Column::Title.eq(title.clone()))
//         .exec(&*db).await
//         .map_err(|e| e.to_string())?;

//     Ok(())
// }

// /// Retrieves all default tags from the database.
// ///
// /// # Arguments
// /// * `app_state` - The Tauri state containing the database connection mutex.
// ///
// /// # Returns
// /// A `Result` containing a `Vec` of default `TagModel` on success, or a `String` error message.
// #[command]
// pub async fn get_default_tags(app_state: State<'_, AppState>) -> Result<Vec<tag::Model>, String> {
//     let db = app_state.conn.lock().await;
//     let tags = tag::Entity
//         ::find()
//         .filter(tag::Column::IsDefault.eq(true))
//         .order_by_asc(tag::Column::Title)
//         .all(&*db).await
//         .map_err(|e| e.to_string())?;
//     Ok(tags)
// }

// /// Retrieves all tags associated with a specific workunit.
// ///
// /// # Arguments
// /// * `app_state` - The Tauri state containing the database connection mutex.
// /// * `workunit_id` - The ID of the workunit to get tags for.
// ///
// /// # Returns
// /// A `Result` containing a `Vec` of `TagModel` on success, or a `String` error message.
// // #[command]
// // pub async fn get_tags_by_workunit(
// //     app_state: State<'_, AppState>,
// //     workunit_id: i32
// // ) -> Result<Vec<tag::Model>, String> {
// //     let db = app_state.conn.lock().await;
// //     let tags = tag::Entity
// //         ::find()
// //         .join(JoinType::InnerJoin, tag::Relation::WorkunitTags.def())
// //         .filter(workunit_tag::Column::WorkunitId.eq(workunit_id))
// //         .all(&*db).await
// //         .map_err(|e| e.to_string())?;
// //     Ok(tags)
// // }

// /// Associates a tag with a workunit.
// ///
// /// # Arguments
// /// * `app_state` - The Tauri state containing the database connection mutex.
// /// * `workunit_id` - The ID of the workunit.
// /// * `tag_title` - The title of the tag.
// ///
// /// # Returns
// /// A `Result` indicating success (`()`) or a `String` error message.
// #[command]
// pub async fn add_tag_to_workunit(
//     app_state: State<'_, AppState>,
//     workunit_id: i32,
//     tag_title: String
// ) -> Result<(), String> {
//     let db = app_state.conn.lock().await;

//     let new_workunit_tag = workunit_tag::ActiveModel {
//         workunit_id: Set(workunit_id),
//         tag: Set(tag_title),
//     };

//     new_workunit_tag.insert(&*db).await.map_err(|e| e.to_string())?;
//     Ok(())
// }

// /// Removes a tag from a workunit.
// ///
// /// # Arguments
// /// * `app_state` - The Tauri state containing the database connection mutex.
// /// * `workunit_id` - The ID of the workunit.
// /// * `tag_title` - The title of the tag.
// ///
// /// # Returns
// /// A `Result` indicating success (`()`) or a `String` error message.
// #[command]
// pub async fn remove_tag_from_workunit(
//     app_state: State<'_, AppState>,
//     workunit_id: i32,
//     tag_title: String
// ) -> Result<(), String> {
//     let db = app_state.conn.lock().await;

//     workunit_tag::Entity
//         ::delete_many()
//         .filter(workunit_tag::Column::WorkunitId.eq(workunit_id))
//         .filter(workunit_tag::Column::Tag.eq(tag_title.clone()))
//         .exec(&*db).await
//         .map_err(|e| e.to_string())?;

//     Ok(())
// }
