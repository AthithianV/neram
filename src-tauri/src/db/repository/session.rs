use std::collections::HashMap;

use chrono::Datelike;
use migration::Expr;
use sea_orm::*;

use crate::{
    models::session::{
        CreateSessionModel, FullSessionModel, GroupedSessions, SessionGroupType, UpdateSessionModel,
    },
    time::now,
};
use ::entity::{
    projects::Entity as Project,
    sessions::{
        ActiveModel as SessionActiveModel, Column as SessionColumn, Entity as Session,
        Model as SessionModel,
    },
    sessions_tags::{ActiveModel as SessionTagsActiveModel, Entity as SessionTags},
    tags::Entity as Tag,
};

pub struct SessionRepository<'a> {
    db: &'a DatabaseConnection,
}

impl<'a> SessionRepository<'a> {
    pub fn new(db: &'a DatabaseConnection) -> Self {
        Self { db }
    }

    pub async fn create(&self, session: &CreateSessionModel) -> Result<SessionModel, DbErr> {
        let active_model = SessionActiveModel {
            title: Set(session.title.clone()),
            description: Set(session.description.clone()),
            project_id: Set(session.project_id),
            task_id: Set(session.task_id),
            date: Set(session.date),
            start_time: Set(session.start_time),
            end_time: Set(session.end_time.map(|t| t)),
            session_duration_sec: Set(session.session_duration_sec),
            break_duration_sec: Set(session.break_duration_sec),
            created_at: Set(now()),
            updated_at: Set(now()),
            ..Default::default()
        };

        let model = active_model.insert(self.db).await?;
        Ok(model)
    }

    pub async fn find_by_id(&self, id: i32) -> Result<Option<FullSessionModel>, DbErr> {
        let session = Session::find_by_id(id)
            .find_also_related(Project)
            .one(self.db)
            .await?;

        if let Some((session_model, project_model)) = session {
            let tags = session_model.find_related(Tag).all(self.db).await?;

            let full_model = FullSessionModel::from((session_model, project_model, tags));
            Ok(Some(full_model))
        } else {
            Ok(None)
        }
    }

    pub async fn find_all(
        &self,
        group_by: SessionGroupType,
    ) -> Result<Vec<GroupedSessions>, DbErr> {
        let sessions = Session::find()
            .find_also_related(Project)
            .order_by_desc(SessionColumn::Date)
            .order_by_desc(SessionColumn::StartTime)
            .all(self.db)
            .await?;

        // (group_by → (sessions, total_duration, title))
        let mut grouped: HashMap<String, (Vec<FullSessionModel>, i64, String)> = HashMap::new();

        for session in sessions {
            let (session_model, project_model) = session;

            let date = session_model.date;
            let duration = session_model.session_duration_sec as i64;

            let tags = session_model.find_related(Tag).all(self.db).await?;
            let full_session = FullSessionModel::from((session_model, project_model, tags));

            // Generate group key
            let key = match group_by {
                SessionGroupType::Date => date.to_string(),
                SessionGroupType::Week => {
                    let iso_week = date.iso_week();
                    format!("{}-W{}", iso_week.year(), iso_week.week())
                }
                SessionGroupType::Month => format!("{}-{:02}", date.year(), date.month()),
                SessionGroupType::Year => date.year().to_string(),
            };

            let title = match group_by {
                SessionGroupType::Date => date.format("%A, %d %B %Y").to_string(),
                // → "Sunday, 17 August 2025"
                SessionGroupType::Week => {
                    let iso_week = date.iso_week();
                    format!("Week {} of {}", iso_week.week(), iso_week.year())
                }
                // → "Week 33 of 2025"
                SessionGroupType::Month => date.format("%B %Y").to_string(),
                // → "August 2025"
                SessionGroupType::Year => date.format("%Y").to_string(),
                // → "2025"
            };

            // Insert into group and add duration
            let entry = grouped.entry(key).or_insert_with(|| (Vec::new(), 0, title));
            entry.0.push(full_session);
            entry.1 += duration;
        }

        // Convert HashMap into Vec<GroupedSessions>
        let mut results: Vec<GroupedSessions> = grouped
            .into_iter()
            .map(
                |(group_by, (sessions, total_duration_sec, title))| GroupedSessions {
                    group_by,
                    total_duration_sec,
                    sessions,
                    title,
                },
            )
            .collect();

        // Sort groups (newest first)
        results.sort_by(|a, b| b.group_by.cmp(&a.group_by));

        Ok(results)
    }

    pub async fn update(
        &self,
        session_to_update: &UpdateSessionModel,
        session_id: i32,
    ) -> Result<(), DbErr> {
        let session = Session::find_by_id(session_id).one(self.db).await?;
        let mut session: SessionActiveModel = session.unwrap().into();

        if let Some(ref title) = session_to_update.title {
            session.title = Set(Some(title.clone()));
        }

        if let Some(ref description) = session_to_update.description {
            session.description = Set(Some(description.clone()));
        }

        if let Some(project_id) = session_to_update.project_id {
            session.project_id = Set(project_id);
        }

        if let Some(ref date) = session_to_update.date {
            session.date = Set(date.clone());
        }

        if let Some(ref start_time) = session_to_update.start_time {
            session.start_time = Set(start_time.clone());
        }

        if let Some(ref end_time) = session_to_update.end_time {
            if let Some(end_time) = end_time {
                session.end_time = Set(Some(end_time.clone()));
            } else {
                session.end_time = Set(None);
            }
        }

        if let Some(session_duration_sec) = session_to_update.session_duration_sec {
            session.session_duration_sec = Set(session_duration_sec);
        }

        if let Some(break_duration_sec) = session_to_update.break_duration_sec {
            session.break_duration_sec = Set(break_duration_sec);
        }

        session.updated_at = Set(now());

        session.update(self.db).await?;
        Ok(())
    }

    pub async fn delete(&self, id: i32) -> Result<DeleteResult, DbErr> {
        let result = Session::delete_by_id(id).exec(self.db).await?;
        Ok(result)
    }

    pub async fn add_tag_to_session(&self, session_id: i32, tag_id: i32) -> Result<(), DbErr> {
        let active_model = SessionTagsActiveModel {
            session_id: Set(session_id),
            tag_id: Set(tag_id),
        };

        active_model.insert(self.db).await?;
        Ok(())
    }

    pub async fn remove_tag_from_session(&self, session_id: i32, tag_id: i32) -> Result<(), DbErr> {
        <SessionTags as EntityTrait>::delete_many()
            .filter(<SessionTags as EntityTrait>::Column::SessionId.eq(session_id))
            .filter(<SessionTags as EntityTrait>::Column::TagId.eq(tag_id))
            .exec(self.db)
            .await?;
        Ok(())
    }

    pub async fn collides_on_day(
        &self,
        new_start: i64,
        new_end: Option<i64>,
        session_id: i32,
    ) -> Result<bool, DbErr> {
        let mut cond = Condition::all();

        // existing.start_time < new_end AND (existing.end_time IS NULL OR existing.end_time > new_start)
        if let Some(new_end) = new_end {
            cond = cond
                .add(Expr::col(SessionColumn::StartTime).lte(new_end.clone()))
                .add(
                    Condition::any()
                        .add(Expr::col(SessionColumn::EndTime).is_null())
                        .add(Expr::col(SessionColumn::EndTime).gte(new_start.clone())),
                );
        } else {
            // If new_end is None, session runs indefinitely → any session that overlaps new_start
            cond = cond
                .add(
                    Expr::col(SessionColumn::EndTime)
                        .is_null()
                        .or(Expr::col(SessionColumn::EndTime).gte(new_start.clone())),
                )
                .add(Expr::col(SessionColumn::StartTime).lte(new_start.clone()));
        }

        cond = cond.add(Expr::col(SessionColumn::Id).ne(session_id));

        let cnt = Session::find().filter(cond).all(self.db).await?;
        Ok(cnt.len() > 0)
    }
}
