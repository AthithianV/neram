use sea_orm::*;
use crate::models::session::{
    Entity as Session,
    Model as SessionModel,
    ActiveModel as SessionActiveModel,
    Related,
    SessionWithRelation,
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

    pub async fn find_all(&self) -> Result<Vec<SessionModel>, DbErr> {
        let sessions = Session::find().all(self.db).await?;
        Ok(sessions)
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
}
