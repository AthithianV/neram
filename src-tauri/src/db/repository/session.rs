use sea_orm::*;
use crate::models::{
    project::Entity as Project,
    session::{
        ActiveModel as SessionActiveModel,
        Entity as Session,
        Model as SessionModel,
        ProjectInfo,
        SessionWithRelationStruct,
        TaskInfo,
    },
    tag::Entity as Tag,
    task::Entity as Task,
};

pub struct SessionRepository<'a> {
    db: &'a DatabaseConnection,
}

impl<'a> SessionRepository<'a> {
    pub fn new(db: &'a DatabaseConnection) -> Self {
        Self { db }
    }

    pub async fn create(&self, session: &SessionModel) -> Result<SessionModel, DbErr> {
        let active_model = SessionActiveModel {
            title: Set(session.title.clone()),
            description: Set(session.description.clone()),
            project_id: Set(session.project_id),
            task_id: Set(session.task_id),
            date: Set(session.date.clone()),
            start_time: Set(session.start_time.clone()),
            end_time: Set(session.end_time.clone()),
            session_duration_sec: Set(session.session_duration_sec),
            break_duration_sec: Set(session.break_duration_sec),
            created_at: Set("CURRENT_TIMESTAMP".to_string()),
            updated_at: Set("CURRENT_TIMESTAMP".to_string()),
            ..Default::default()
        };

        let model = active_model.insert(self.db).await?;
        Ok(model)
    }

    pub async fn find_by_id(&self, id: i32) -> Result<Option<SessionModel>, DbErr> {
        let session = Session::find_by_id(id).one(self.db).await?;
        Ok(session)
    }

    // pub async fn find_all(&self) -> Result<Vec<SessionModel>, DbErr> {
    //     let sessions = Session::find().all(self.db).await?;
    //     Ok(sessions)
    // }

    pub async fn find_all(&self) -> Result<Vec<SessionWithRelationStruct>, DbErr> {
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

            let task = task_opt.map(|t| TaskInfo {
                id: t.id,
                title: t.title,
                color: t.color.unwrap(),
            });

            let project = project_opt.map(|p| ProjectInfo {
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

            results.push(SessionWithRelationStruct {
                id: session_model.id,
                title: session_model.title,
                description: session_model.description,
                tags: Vec::new(),
                date: session_model.date,
                start_time: session_model.start_time,
                end_time: session_model.end_time,
                session_duration_sec: session_model.session_duration_sec,
                break_duration_sec: session_model.break_duration_sec,
                task: task.unwrap(),
                project: project.unwrap(),
            });
        }

        Ok(results)
    }

    pub async fn update(&self, session: &SessionModel) -> Result<SessionModel, DbErr> {
        let active_model = SessionActiveModel {
            id: Set(session.id),
            title: Set(session.title.clone()),
            description: Set(session.description.clone()),
            project_id: Set(session.project_id),
            task_id: Set(session.task_id),
            date: Set(session.date.clone()),
            start_time: Set(session.start_time.clone()),
            end_time: Set(session.end_time.clone()),
            session_duration_sec: Set(session.session_duration_sec),
            break_duration_sec: Set(session.break_duration_sec),
            updated_at: Set("CURRENT_TIMESTAMP".to_string()),
            ..Default::default()
        };

        let model = active_model.update(self.db).await?;
        Ok(model)
    }

    pub async fn delete(&self, id: i32) -> Result<DeleteResult, DbErr> {
        let result = Session::delete_by_id(id).exec(self.db).await?;
        Ok(result)
    }

    pub async fn add_tag_to_session(&self, session_id: i32, tag_id: i32) -> Result<(), DbErr> {
        let active_model = crate::models::sessions_tags::ActiveModel {
            session_id: Set(session_id),
            tag_id: Set(tag_id),
        };

        active_model.insert(self.db).await?;
        Ok(())
    }

    pub async fn remove_tag_from_session(&self, session_id: i32, tag_id: i32) -> Result<(), DbErr> {
        let result = crate::models::sessions_tags::Entity
            ::delete_many()
            .filter(crate::models::sessions_tags::Column::SessionId.eq(session_id))
            .filter(crate::models::sessions_tags::Column::TagId.eq(tag_id))
            .exec(self.db).await?;
        Ok(())
    }
}
