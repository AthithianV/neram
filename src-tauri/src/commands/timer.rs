use serde::{ Deserialize, Serialize };
use std::time::{ Duration, Instant };
use tauri::State;
use tokio::sync::Mutex;

#[derive(Debug, Clone, Serialize, Deserialize)]
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
    state: State<'_, Mutex<TimerState>>,
    timer_type: TimerType,
    session_id: Option<i32>
) -> Result<(), String> {
    let mut timer = state.lock().await;
    timer.start_time = Some(Instant::now());
    timer.is_running = true;
    timer.timer_type = timer_type;
    timer.session_id = session_id;
    Ok(())
}

#[tauri::command]
pub async fn stop_timer(state: State<'_, Mutex<TimerState>>) -> Result<u64, String> {
    let mut timer = state.lock().await;
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
pub async fn get_elapsed_time(
    state: State<'_, Mutex<TimerState>>
) -> Result<TimerResponse, String> {
    let timer = state.lock().await;
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
pub async fn reset_timer(state: State<'_, Mutex<TimerState>>) -> Result<(), String> {
    let mut timer = state.lock().await;
    *timer = TimerState::default();
    Ok(())
}
