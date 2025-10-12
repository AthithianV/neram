use crate::models::project::{CreateProjectModel, MinimalProjectModel, ReadProjectModel};
use crate::repository::pomodoro_settings::PomodoroSettingsRepository;
use crate::time::now;
use ::entity::projects::{
    ActiveModel as ProjectActiveModel, Column as ProjectColumn, Entity as Project,
    Model as ProjectModel,
};
use ::entity::projects_tags::{ActiveModel as ProjectsTagsActiveModel, Entity as ProjectsTags};
use ::entity::sessions::{Column as SessionColumn, Entity as Session};
use ::entity::tasks::{Column as TaskColumn, Entity as Task};

use sea_orm::*;
use sea_orm::{ColumnTrait, EntityTrait, QueryFilter};

pub struct ProjectRepository<'a> {
    db: &'a DatabaseConnection,
}

impl<'a> ProjectRepository<'a> {
    pub fn new(db: &'a DatabaseConnection) -> Self {
        Self { db }
    }

    pub async fn create(&self, project: &CreateProjectModel) -> Result<ProjectModel, DbErr> {
        let active_model = ProjectActiveModel {
            title: Set(project.title.clone()),
            description: Set(project.description.clone()),
            color: Set(project.color.clone()),
            client_name: Set(project.client_name.clone()),
            started_at: Set(project.started_at.clone()),
            deadline: Set(project.deadline.clone()),
            completed_at: Set(project.completed_at.clone()),
            is_billable: Set(project.is_billable),
            billing_type: Set(project.billing_type.clone()),
            hourly_rate: Set(project.hourly_rate),
            fixed_rate: Set(project.fixed_rate),
            currency: Set(project.currency.clone()),
            created_at: Set(now()),
            updated_at: Set(now()),
            ..Default::default()
        };

        let model = active_model.insert(self.db).await?;
        Ok(model)
    }

    pub async fn find_by_id(&self, id: i32) -> Result<Option<ReadProjectModel>, DbErr> {
        let project_model = Project::find_by_id(id).one(self.db).await?;
        let project = match project_model {
            Some(project) => Some(ReadProjectModel::from(project)),
            None => None,
        };
        Ok(project)
    }

    pub async fn find_all(&self) -> Result<Vec<MinimalProjectModel>, DbErr> {
        let projects = Project::find()
            .order_by_desc(ProjectColumn::StartedAt)
            .all(self.db)
            .await?;
        let minimal_projects = projects
            .into_iter()
            .map(|project| MinimalProjectModel::from(project))
            .collect();
        Ok(minimal_projects)
    }

    pub async fn update(&self, project: &CreateProjectModel, project_id: i32) -> Result<(), DbErr> {
        let project_opt = Project::find_by_id(project_id).one(self.db).await?;
        let mut project_model: ProjectActiveModel = project_opt.unwrap().into();

        project_model.title = Set(project.title.clone());
        project_model.description = Set(project.description.clone());
        project_model.color = Set(project.color.clone());
        project_model.client_name = Set(project.client_name.clone());
        project_model.started_at = Set(project.started_at.clone());
        project_model.deadline = Set(project.deadline.clone());
        project_model.completed_at = Set(project.completed_at.clone());
        project_model.is_billable = Set(project.is_billable);
        project_model.billing_type = Set(project.billing_type.clone());
        project_model.hourly_rate = Set(project.hourly_rate);
        project_model.fixed_rate = Set(project.fixed_rate);
        project_model.currency = Set(project.currency.clone());
        project_model.updated_at = Set(now());

        let _ = project_model.update(self.db).await?;
        Ok(())
    }

    pub async fn delete(&self, id: i32) -> Result<DeleteResult, DbErr> {
        let _ = Session::delete_many()
            .filter(SessionColumn::ProjectId.eq(id))
            .exec(self.db)
            .await?;
        let _ = Task::delete_many()
            .filter(TaskColumn::ProjectId.eq(id))
            .exec(self.db)
            .await?;

        let pomodoro_setting_repository = PomodoroSettingsRepository::new(self.db);
        pomodoro_setting_repository
            .check_and_remove_project(id)
            .await?;

        let result = Project::delete_by_id(id).exec(self.db).await?;
        Ok(result)
    }

    pub async fn add_tag_to_project(&self, project_id: i32, tag_id: i32) -> Result<(), DbErr> {
        let active_model = ProjectsTagsActiveModel {
            project_id: Set(project_id),
            tag_id: Set(tag_id),
        };

        active_model.insert(self.db).await?;
        Ok(())
    }

    pub async fn remove_tag_from_project(&self, project_id: i32, tag_id: i32) -> Result<(), DbErr> {
        <ProjectsTags as EntityTrait>::delete_many()
            .filter(<ProjectsTags as EntityTrait>::Column::ProjectId.eq(project_id))
            .filter(<ProjectsTags as EntityTrait>::Column::TagId.eq(tag_id))
            .exec(self.db)
            .await?;
        Ok(())
    }
}
