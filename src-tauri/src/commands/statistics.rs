use tauri::{command, State};

use crate::{
    models::statistics::{DayStat, StatisticsFilter},
    repository::statistics::StatisticsRepository,
    AppState,
};

#[command]
pub async fn get_statistics(
    app_state: State<'_, AppState>,
    statistics_filter: StatisticsFilter,
) -> Result<Vec<DayStat>, String> {
    let db = app_state.conn.lock().await;

    let statistics_repository = StatisticsRepository::new(&db);
    let result = statistics_repository
        .get_statistics(statistics_filter)
        .await
        .map_err(|e| {
            println!("Error creating session: {:?}", e);
            e.to_string()
        });
    result
}
