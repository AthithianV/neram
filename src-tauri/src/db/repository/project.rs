use sea_orm::*;
use sea_orm::{ EntityTrait, ColumnTrait, QueryFilter };
use ::entity::projects::{
    Entity as Project,
    Model as ProjectModel,
    ActiveModel as ProjectActiveModel,
};
use ::entity::projects_tags::{ Entity as ProjectsTags, ActiveModel as ProjectsTagsActiveModel };
use crate::models::project::{CreateProjectModel, MinimalProjectModel};

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
            status: Set(project.status.clone()),
            started_at: Set(project.started_at.clone()),
            deadline: Set(project.deadline.clone()),
            completed_at: Set(project.completed_at.clone()),
            is_billable: Set(project.is_billable),
            billing_type: Set(project.billing_type.clone()),
            hourly_rate: Set(project.hourly_rate),
            fixed_rate: Set(project.fixed_rate),
            currency: Set(project.currency.clone()),
            created_at: Set("CURRENT_TIMESTAMP".to_string()),
            updated_at: Set("CURRENT_TIMESTAMP".to_string()),
            ..Default::default()
        };

        let model = active_model.insert(self.db).await?;
        Ok(model)
    }

    pub async fn find_by_id(&self, id: i32) -> Result<Option<ProjectModel>, DbErr> {
        let project = Project::find_by_id(id).one(self.db).await?;
        Ok(project)
    }

    pub async fn find_all(&self) -> Result<Vec<MinimalProjectModel>, DbErr> {
        let projects = Project::find().all(self.db).await?;
        let minimal_projects = projects.into_iter().map(|project| MinimalProjectModel {
            id: project.id,
            title: project.title,
            color: project.color,
        }).collect();
        Ok(minimal_projects)
    }

    pub async fn update(&self, project: &ProjectModel) -> Result<ProjectModel, DbErr> {
        let active_model = ProjectActiveModel {
            id: Set(project.id),
            title: Set(project.title.clone()),
            description: Set(project.description.clone()),
            color: Set(project.color.clone()),
            client_name: Set(project.client_name.clone()),
            status: Set(project.status.clone()),
            started_at: Set(project.started_at.clone()),
            deadline: Set(project.deadline.clone()),
            completed_at: Set(project.completed_at.clone()),
            is_billable: Set(project.is_billable),
            billing_type: Set(project.billing_type.clone()),
            hourly_rate: Set(project.hourly_rate),
            fixed_rate: Set(project.fixed_rate),
            currency: Set(project.currency.clone()),
            updated_at: Set("CURRENT_TIMESTAMP".to_string()),
            ..Default::default()
        };

        let model = active_model.update(self.db).await?;
        Ok(model)
    }

    pub async fn delete(&self, id: i32) -> Result<DeleteResult, DbErr> {
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
        let result = <ProjectsTags as EntityTrait>
            ::delete_many()
            .filter(<ProjectsTags as EntityTrait>::Column::ProjectId.eq(project_id))
            .filter(<ProjectsTags as EntityTrait>::Column::TagId.eq(tag_id))
            .exec(self.db).await?;
        Ok(())
    }
}
