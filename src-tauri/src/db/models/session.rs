use serde::{ Deserialize, Serialize };
use chrono::{ NaiveDateTime };
use crate::{ time::{ parse_time, parse_time_with_option } };
use ::entity::{
    projects::{ Model as ProjectModel },
    tasks::{ Model as TaskModel },
    tags::{ Model as TagModel },
    sessions::{ Model as SessionModel },
};

#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
pub struct CreateSessionModel {
    pub title: Option<String>,
    pub description: Option<String>,
    pub project_id: i32,
    pub task_id: i32,
    pub date: NaiveDateTime,
    pub start_time: NaiveDateTime,
    pub end_time: Option<NaiveDateTime>,
    pub session_duration_sec: i32,
    pub break_duration_sec: i32,
    pub tags: Vec<i32>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UpdateSessionModel {
    pub title: Option<String>,
    pub description: Option<String>,
    pub project_id: Option<i32>,
    pub task_id: Option<i32>,
    pub date: Option<NaiveDateTime>,
    pub start_time: Option<NaiveDateTime>,
    pub end_time: Option<Option<NaiveDateTime>>,
    pub session_duration_sec: Option<i32>,
    pub break_duration_sec: Option<i32>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Extra {
    pub id: i32,
    pub title: String,
    pub color: String,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct FullSessionModel {
    pub id: i32,
    pub title: Option<String>,
    pub description: Option<String>,
    pub task: Extra,
    pub project: Extra,
    pub tags: Vec<Extra>,
    pub date: NaiveDateTime,
    pub start_time: NaiveDateTime,
    pub end_time: Option<NaiveDateTime>,
    pub session_duration_sec: i32,
    pub break_duration_sec: i32,
}

impl From<(SessionModel, Option<TaskModel>, Option<ProjectModel>, Vec<TagModel>)>
for FullSessionModel {
    fn from(input: (SessionModel, Option<TaskModel>, Option<ProjectModel>, Vec<TagModel>)) -> Self {
        let (session, task_opt, project_opt, tag_models) = input;

        let task = task_opt.map(|t| Extra {
            id: t.id,
            title: t.title,
            color: t.color,
        });

        let project = project_opt.map(|p| Extra {
            id: p.id,
            title: p.title,
            color: p.color,
        });

        let tags = tag_models
            .into_iter()
            .map(|t| Extra {
                id: t.id,
                title: t.title,
                color: t.color,
            })
            .collect();

        FullSessionModel {
            id: session.id,
            title: session.title,
            description: session.description,
            tags,
            date: parse_time(session.date),
            start_time: parse_time(session.start_time),
            end_time: parse_time_with_option(session.end_time),
            session_duration_sec: session.session_duration_sec,
            break_duration_sec: session.break_duration_sec,
            task: task.unwrap(),
            project: project.unwrap(),
        }
    }
}
