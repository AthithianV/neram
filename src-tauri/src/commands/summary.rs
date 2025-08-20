use chrono::NaiveDateTime;
use tauri::{command, State};

use crate::{
    models::summary::{CalendarWeek, DaySummary, LifeTimeSummary, MonthlySummary, Streak},
    repository::summary::SummaryRepository,
    AppState,
};

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

#[command]
pub async fn get_streaks(app_state: State<'_, AppState>) -> Result<Streak, String> {
    let db = app_state.conn.lock().await;

    let summary_repository = SummaryRepository::new(&db);
    let result = summary_repository.get_streaks().await.map_err(|e| {
        println!("Error creating session: {:?}", e);
        e.to_string()
    });
    result
}

#[command]
pub async fn get_life_time_summary(
    app_state: State<'_, AppState>,
) -> Result<LifeTimeSummary, String> {
    let db = app_state.conn.lock().await;

    let summary_repository = SummaryRepository::new(&db);
    let result = summary_repository
        .get_life_time_summary()
        .await
        .map_err(|e| {
            println!("Error creating session: {:?}", e);
            e.to_string()
        });
    result
}

#[command]
pub async fn get_monthly_summary(
    app_state: State<'_, AppState>,
    year: i32,
    month: u32,
) -> Result<Vec<CalendarWeek>, String> {
    let db = app_state.conn.lock().await;

    let summary_repository = SummaryRepository::new(&db);
    let result = summary_repository
        .get_monthly_calendar(year, month)
        .await
        .map_err(|e| {
            println!("Error creating session: {:?}", e);
            e.to_string()
        });
    result
}
