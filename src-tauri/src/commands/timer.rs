use serde::{ Deserialize, Serialize };
use std::time::{ Instant };
use tauri::State;

use crate::AppState;

// Define your timer state
#[derive(Debug, Clone)]
pub struct TimerState {
    pub session_start_time: Option<Instant>,
    pub session_time_elased: i32,
    pub break_start_time: Option<Instant>,
    pub break_time_elased: i32,
    pub session_id: Option<i32>,
}

impl Default for TimerState {
    fn default() -> Self {
        Self {
            session_start_time: None,
            session_time_elased: 0,
            break_start_time: None,
            break_time_elased: 0,
            session_id: None,
        }
    }
}

///
/// Function to Start the Timer by Setting the start_time.
/// Accept an option of session_id. If session_id is None then timer will be considered pomodoro
/// If session_id is Some, then timer will be considered Session.
/// If timer is already running, then return Err.
#[tauri::command]
pub async fn start_timer(
    state: State<'_, AppState>,
    session_id: Option<i32>
) -> Result<(), String> {
    let mut timer = state.timer.lock().await;
    timer.session_start_time = Some(Instant::now());
    timer.session_id = session_id;
    Ok(())
}

#[tauri::command]
pub async fn pause_timer(state: State<'_, AppState>) -> Result<(), String> {
    let mut timer = state.timer.lock().await;

    if let Some(session_start_timer) = timer.session_start_time {
        let time_elapsed = session_start_timer.elapsed();
        timer.session_time_elased = timer.session_time_elased + (time_elapsed.as_secs() as i32);
        timer.session_start_time = None;
        timer.break_start_time = Some(Instant::now());
    }

    Ok(())
}

#[tauri::command]
pub async fn resume_timer(state: State<'_, AppState>) -> Result<(), String> {
    let mut timer = state.timer.lock().await;

    if let Some(session_break_start) = timer.break_start_time {
        let time_elapsed = session_break_start.elapsed();
        timer.break_time_elased = timer.break_time_elased + (time_elapsed.as_secs() as i32);
        timer.break_start_time = None;
        timer.session_start_time = Some(Instant::now());
    }

    Ok(())
}

#[tauri::command]
pub async fn stop_timer(state: State<'_, AppState>) -> Result<(), String> {
    let mut timer = state.timer.lock().await;
    *timer = TimerState::default();
    Ok(())
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TimerResponse {
    pub session_time_elased: i32,
    pub break_time_elased: i32,
    pub session_id: Option<i32>,
}

#[tauri::command]
pub async fn get_elapsed_time(state: State<'_, AppState>) -> Result<TimerResponse, String> {
    let mut timer = state.timer.lock().await;

    if let Some(session_start_timer) = timer.session_start_time {
        let time_elapsed = session_start_timer.elapsed();
        timer.session_time_elased = timer.session_time_elased + (time_elapsed.as_secs() as i32);
    }

    if let Some(break_start_time) = timer.break_start_time {
        let time_elapsed = break_start_time.elapsed();
        timer.break_time_elased = timer.break_time_elased + (time_elapsed.as_secs() as i32);
    }
    Ok(TimerResponse {
        session_time_elased: timer.session_time_elased,
        break_time_elased: timer.break_time_elased,
        session_id: timer.session_id,
    })
}
