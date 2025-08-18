use chrono::NaiveDateTime;
use tauri::{command, State};

use crate::{models::summary::DaySummary, repository::summary::SummaryRepository, AppState};

#[command]
pub async fn get_day_summary(
    app_state: State<'_, AppState>,
    date: NaiveDateTime,
) -> Result<DaySummary, String> {
    let db = app_state.conn.lock().await;

    let summary_repository = SummaryRepository::new(&db);
    let result = summary_repository.get_day_summary(date).await.map_err(|e| {
        println!("Error creating session: {:?}", e);
        e.to_string()
    });
    result
}
