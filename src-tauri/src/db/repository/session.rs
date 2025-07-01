use sea_orm::*;
use ::entity::{
    projects::Entity as Project,
    sessions::{ ActiveModel as SessionActiveModel, Entity as Session, Model as SessionModel },
    tasks::Entity as Task,
    sessions_tags::{ Entity as SessionTags, ActiveModel as SessionTagsActiveModel },
};
use crate::{
    models::session::{ CreateSessionModel, Extra, FullSessionModel },
    time::{ parse_time, parse_time_with_option },
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
            date: Set(session.date.to_string()),
            start_time: Set(session.start_time.to_string()),
            end_time: Set(session.end_time.map(|t| t.to_string())),
            session_duration_sec: Set(session.session_duration_sec),
            break_duration_sec: Set(session.break_duration_sec),
            created_at: Set("CURRENT_TIMESTAMP".to_string()),
            updated_at: Set("CURRENT_TIMESTAMP".to_string()),
            ..Default::default()
        };

        let model = active_model.insert(self.db).await?;
        Ok(model)
    }

    pub async fn find_by_id(&self, id: i32) -> Result<Option<FullSessionModel>, DbErr> {
        let session = Session::find_by_id(id)
            .find_also_related(Task)
            .find_also_related(Project)
            .one(self.db).await?;

        // let (session, task, project) = session.map(|f| (f.0, f.1, f.2));

        let result = match session {
            Some(s) => {
                let (session_model, task_opt, project_opt) = s;
                let task = task_opt.unwrap();
                let project = project_opt.unwrap();
                let current_session = FullSessionModel {
                    id: session_model.id,
                    title: session_model.title,
                    description: session_model.description,
                    tags: Vec::new(),
                    date: parse_time(session_model.date),
                    start_time: parse_time(session_model.start_time),
                    end_time: parse_time_with_option(session_model.end_time),
                    session_duration_sec: session_model.session_duration_sec,
                    break_duration_sec: session_model.break_duration_sec,
                    task: Extra {
                        id: task.id,
                        title: task.title,
                        color: task.color.unwrap(),
                    },
                    project: Extra {
                        id: project.id,
                        title: project.title,
                        color: project.color.unwrap(),
                    },
                };
                Some(current_session)
            }
            None => None,
        };

        Ok(result)
    }

    pub async fn find_all(&self) -> Result<Vec<FullSessionModel>, DbErr> {
        let sessions = Session::find()
            .find_also_related(Task)
            .find_also_related(Project)
            .all(self.db).await?;

        let mut results = Vec::new();

        for (session_model, task_opt, project_opt) in sessions {
            // Load related tags for this session
            // let tag_models = session_model
            //     .find_linked(TagViaSessionTags) // <-- Make sure you define the `Link`
            //     .all(self.db).await?;

            let task = task_opt.map(|t| Extra {
                id: t.id,
                title: t.title,
                color: t.color.unwrap(),
            });

            let project = project_opt.map(|p| Extra {
                id: p.id,
                title: p.title,
                color: p.color.unwrap(),
            });

            // let tags = tag_
            //     .into_iter()
            //     .map(|tag| Related {
            //         id: tag.id,
            //         title: tag.title,
            //         color: tag.color.unwrap_or_default(),
            //     })
            //     .collect();

            results.push(FullSessionModel {
                id: session_model.id,
                title: session_model.title,
                description: session_model.description,
                tags: Vec::new(),
                date: parse_time(session_model.date),
                start_time: parse_time(session_model.start_time),
                end_time: parse_time_with_option(session_model.end_time),
                session_duration_sec: session_model.session_duration_sec,
                break_duration_sec: session_model.break_duration_sec,
                task: task.unwrap(),
                project: project.unwrap(),
            });
        }

        Ok(results)
    }

    pub async fn update(
        &self,
        session_to_update: &CreateSessionModel,
        session_id: i32
    ) -> Result<(), DbErr> {
        let session = Session::find_by_id(session_id).one(self.db).await?;
        let mut session: SessionActiveModel = session.unwrap().into();

        let end_time = match session_to_update.end_time {
            Some(et) => Some(et.clone().to_string()),
            None => None,
        };

        session.title = Set(session_to_update.title.clone());
        session.description = Set(session_to_update.description.clone());
        session.project_id = Set(session_to_update.project_id);
        session.task_id = Set(session_to_update.task_id);
        session.date = Set(session_to_update.date.clone().to_string());
        session.start_time = Set(session_to_update.start_time.clone().to_string());
        session.end_time = Set(end_time);
        session.session_duration_sec = Set(session_to_update.session_duration_sec);
        session.break_duration_sec = Set(session_to_update.break_duration_sec);
        session.updated_at = Set("CURRENT_TIMESTAMP".to_string());

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
        <SessionTags as EntityTrait>
            ::delete_many()
            .filter(<SessionTags as EntityTrait>::Column::SessionId.eq(session_id))
            .filter(<SessionTags as EntityTrait>::Column::TagId.eq(tag_id))
            .exec(self.db).await?;
        Ok(())
    }
}
