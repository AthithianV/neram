use serde::{ Deserialize, Serialize };
use std::time::{ Duration, Instant };
use tauri::State;
use tokio::sync::Mutex;
use sea_orm::*;

use crate::AppState;
use ::entity::sessions::{ Entity as Session, ActiveModel as SessionActiveModel };

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum TimerType {
    Session,
    Break,
    Pomodaro,
}

// Define your timer state
#[derive(Debug, Clone)]
pub struct TimerState {
    pub start_time: Option<Instant>,
    pub total_elapsed: Duration,
    pub is_running: bool,
    pub timer_type: TimerType,
    pub session_id: Option<i32>,
}

impl Default for TimerState {
    fn default() -> Self {
        Self {
            start_time: None,
            total_elapsed: Duration::from_secs(0),
            is_running: false,
            timer_type: TimerType::Session,
            session_id: None,
        }
    }
}

// Tauri commands that share the same state
#[tauri::command]
pub async fn start_timer(
    state: State<'_, AppState>,
    timer_type: TimerType,
    session_id: Option<i32>
) -> Result<(), String> {
    let mut timer = state.timer.lock().await;
    timer.start_time = Some(Instant::now());
    timer.is_running = true;
    timer.timer_type = timer_type;
    timer.session_id = session_id;
    Ok(())
}

#[tauri::command]
pub async fn pause_timer(
    state: State<'_, AppState>,
    session_id: Option<i32>
) -> Result<(), String> {
    let mut timer = state.timer.lock().await;
    let db = state.conn.lock().await;

    let time_elapsed = if let Some(start) = timer.start_time {
        start.elapsed()
    } else {
        Duration::from_secs(0)
    };

    let timer_type = timer.timer_type.clone();
    let is_running = timer.is_running;
    let session_id = timer.session_id;

    // If timer is Session, then Update Session Duration or Break Duration in DB.
    if let Some(id) = session_id {
        let model_opt = Session::find_by_id(id)
            .one(&*db).await
            .map_err(|e| e.to_string())?;

        let mut active_session: SessionActiveModel = match model_opt {
            Some(m) => m.into(),
            None => {
                return Err(format!("Session {id} not found"));
            }
        };

        match timer_type {
            TimerType::Session => {
                active_session.session_duration_sec = Set(time_elapsed.as_secs() as i32);
            }
            TimerType::Break => {
                active_session.break_duration_sec = Set(time_elapsed.as_secs() as i32);
            }
            _ => {}
        }

        active_session.update(&*db).await.map_err(|e| e.to_string())?;
    }

    timer.start_time = Some(Instant::now());
    timer.is_running = true;
    timer.timer_type = TimerType::Break;
    timer.session_id = session_id;

    Ok(())
}

#[tauri::command]
pub async fn stop_timer(state: State<'_, AppState>) -> Result<u64, String> {
    let mut timer = state.timer.lock().await;

    if let Some(start) = timer.start_time {
        timer.total_elapsed += start.elapsed();
        timer.start_time = None;
        timer.is_running = false;
        timer.session_id = None;
        Ok(timer.total_elapsed.as_secs())
    } else {
        Err("Timer not running".to_string())
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TimerResponse {
    pub time: u64,
    pub timer_type: TimerType,
    pub is_running: bool,
    pub session_id: Option<i32>,
}

#[tauri::command]
pub async fn get_elapsed_time(state: State<'_, AppState>) -> Result<TimerResponse, String> {
    let timer = state.timer.lock().await;

    let current_session = if let Some(start) = timer.start_time {
        start.elapsed()
    } else {
        Duration::from_secs(0)
    };
    let time = (timer.total_elapsed + current_session).as_secs();
    let timer_type = timer.timer_type.clone();
    let is_running = timer.is_running;
    let session_id = timer.session_id;

    Ok(TimerResponse {
        time,
        timer_type,
        is_running,
        session_id,
    })
}

#[tauri::command]
pub async fn reset_timer(state: State<'_, AppState>) -> Result<(), String> {
    let mut timer = state.timer.lock().await;
    *timer = TimerState::default();
    Ok(())
}
