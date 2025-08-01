use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};

use crate::models::project::MinimalProjectModel;

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct ProjectDayStat {
    pub project: MinimalProjectModel,
    pub total_seconds: i64,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct DayStat {
    pub date: NaiveDateTime,
    pub projects: Vec<ProjectDayStat>,
    pub total_seconds: i64,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct StatisticsFilter {
    pub start_date: NaiveDateTime,
    pub end_date: NaiveDateTime,
    pub project_ids: Option<Vec<i32>>,
    pub tag_ids: Option<Vec<i32>>,
}
