use chrono::NaiveDate;
use entity::{
    projects::Model as ProjectModel, sessions::Model as SessionModel, tags::Model as TagModel,
};
use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
pub struct CreateSessionModel {
    pub title: Option<String>,
    pub description: Option<String>,
    pub project_id: i32,
    pub task_id: Option<i32>,
    pub date: NaiveDate,
    pub start_time: i64,
    pub end_time: Option<i64>,
    pub session_duration_sec: i32,
    pub break_duration_sec: i32,
    pub tags: Vec<i32>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UpdateSessionModel {
    pub title: Option<String>,
    pub description: Option<String>,
    pub project_id: Option<i32>,
    pub date: Option<NaiveDate>,
    pub start_time: Option<i64>,
    pub end_time: Option<Option<i64>>,
    pub session_duration_sec: Option<i32>,
    pub break_duration_sec: Option<i32>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Extra {
    pub id: i32,
    pub title: String,
    pub color: Option<String>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct FullSessionModel {
    pub id: i32,
    pub title: Option<String>,
    pub description: Option<String>,
    pub project_id: i32,
    pub task_id: Option<i32>,
    pub project: Extra,
    pub tags: Vec<Extra>,
    pub date: NaiveDate,
    pub start_time: i64,
    pub end_time: Option<i64>,
    pub session_duration_sec: i32,
    pub break_duration_sec: i32,
}

impl From<(SessionModel, Option<ProjectModel>, Vec<TagModel>)> for FullSessionModel {
    fn from(input: (SessionModel, Option<ProjectModel>, Vec<TagModel>)) -> Self {
        let (session, project_opt, tag_models) = input;

        let project = project_opt.map(|p| Extra {
            id: p.id,
            title: p.title,
            color: Some(p.color),
        });

        let tags = tag_models
            .into_iter()
            .map(|t| Extra {
                id: t.id,
                title: t.title,
                color: Some(t.color),
            })
            .collect();

        FullSessionModel {
            id: session.id,
            title: session.title,
            description: session.description,
            tags,
            date: session.date,
            start_time: session.start_time,
            end_time: session.end_time,
            session_duration_sec: session.session_duration_sec,
            break_duration_sec: session.break_duration_sec,
            project: project.unwrap(),
            project_id: session.project_id,
            task_id: session.task_id,
        }
    }
}

#[derive(Serialize, Deserialize)]
pub enum SessionGroupType {
    Date,
    Week,
    Month,
    Year,
}

#[derive(Serialize, Deserialize)]
pub struct GroupedSessions {
    pub title: String,
    pub group_by: String,
    pub total_duration_sec: i64,
    pub sessions: Vec<FullSessionModel>,
}
