use serde::{Deserialize, Serialize};
use std::time::Instant;
use tauri::State;

use crate::AppState;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum TimerType {
    Session,
    Pomodoro,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TimerState {
    #[serde(skip)]
    pub session_start_time: Option<Instant>,
    pub session_time_elapsed: i32,
    #[serde(skip)]
    pub break_start_time: Option<Instant>,
    pub break_time_elapsed: i32,
    pub session_id: Option<i32>,
    pub is_session: bool,
    pub is_break: bool,
    pub timer_type: TimerType,
}

impl Default for TimerState {
    fn default() -> Self {
        Self {
            session_start_time: None,
            session_time_elapsed: 0,
            break_start_time: None,
            break_time_elapsed: 0,
            session_id: None,
            is_session: false,
            is_break: false,
            timer_type: TimerType::Session,
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
    session_id: Option<i32>,
    timer_type: Option<TimerType>,
) -> Result<(), String> {
    let mut timer = state.timer.lock().await;
    timer.session_start_time = Some(Instant::now());
    timer.session_id = session_id;
    timer.is_session = true;

    if let Some(timer_type) = timer_type {
        timer.timer_type = timer_type;
    }

    Ok(())
}

#[tauri::command]
pub async fn pause_timer(state: State<'_, AppState>) -> Result<(), String> {
    let mut timer = state.timer.lock().await;

    if let Some(session_start_timer) = timer.session_start_time {
        let time_elapsed = session_start_timer.elapsed();
        timer.session_time_elapsed = timer.session_time_elapsed + (time_elapsed.as_secs() as i32);
    }

    timer.session_start_time = None;
    timer.break_start_time = Some(Instant::now());
    timer.is_session = false;
    timer.is_break = true;

    Ok(())
}

#[tauri::command]
pub async fn resume_timer(state: State<'_, AppState>) -> Result<(), String> {
    let mut timer = state.timer.lock().await;

    if let Some(break_start_time) = timer.break_start_time {
        let time_elapsed = break_start_time.elapsed();
        timer.break_time_elapsed = timer.break_time_elapsed + (time_elapsed.as_secs() as i32);
    }

    timer.break_start_time = None;
    timer.session_start_time = Some(Instant::now());
    timer.is_session = true;
    timer.is_break = false;

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
    pub session_time_elapsed: i32,
    pub break_time_elapsed: i32,
    pub session_id: Option<i32>,
    pub is_session: bool,
    pub is_break: bool,
    pub timer: i32,
    pub timer_type: TimerType,
}

#[tauri::command]
pub async fn get_elapsed_time(state: State<'_, AppState>) -> Result<TimerResponse, String> {
    let timer = state.timer.lock().await;

    let mut current_time = 0;
    let current_session_time_elapsed = match timer.session_start_time {
        Some(start) => {
            current_time = start.elapsed().as_secs() as i32;
            timer.session_time_elapsed + current_time
        }
        None => timer.session_time_elapsed,
    };

    let current_break_time_elapsed = match timer.break_start_time {
        Some(start) => {
            current_time = start.elapsed().as_secs() as i32;
            timer.break_time_elapsed + current_time
        }
        None => timer.break_time_elapsed,
    };

    Ok(TimerResponse {
        session_time_elapsed: current_session_time_elapsed,
        break_time_elapsed: current_break_time_elapsed,
        session_id: timer.session_id,
        is_session: timer.is_session,
        is_break: timer.is_break,
        timer: current_time,
        timer_type: timer.timer_type,
    })
}
