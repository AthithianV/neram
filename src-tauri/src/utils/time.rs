use chrono::{NaiveDateTime, Utc};

pub fn parse_time(time: String) -> NaiveDateTime {
    NaiveDateTime::parse_from_str(&time, "%Y-%m-%d %H:%M:%S").unwrap()
}

pub fn parse_time_with_option(time: Option<String>) -> Option<NaiveDateTime> {
    match time {
        Some(t) => Some(NaiveDateTime::parse_from_str(&t, "%Y-%m-%d %H:%M:%S").unwrap()),
        None => None,
    }
}

pub fn now() -> String {
    Utc::now().naive_local().to_string()
}
