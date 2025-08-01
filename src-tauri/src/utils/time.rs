use chrono::{NaiveDateTime, Timelike, Utc};

pub fn now() -> NaiveDateTime {
    Utc::now().naive_local().with_nanosecond(0).unwrap()
}
