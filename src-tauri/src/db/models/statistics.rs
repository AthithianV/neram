use chrono::NaiveDate;
use serde::{Deserialize, Serialize};

use crate::models::project::MinimalProjectModel;

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct ProjectDayStat {
    pub project: MinimalProjectModel,
    pub total_seconds: i64,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct DayStat {
    pub date: NaiveDate,
    pub projects: Vec<ProjectDayStat>,
    pub total_seconds: i64,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct StatisticsFilter {
    pub start_date: NaiveDate,
    pub end_date: NaiveDate,
    pub project_ids: Option<Vec<i32>>,
    pub tag_ids: Option<Vec<i32>>,
}
