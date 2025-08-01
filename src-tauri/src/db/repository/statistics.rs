use std::collections::{BTreeMap, HashMap};

use chrono::NaiveDateTime;
use sea_orm::*;

use crate::models::{
    project::MinimalProjectModel,
    statistics::{DayStat, ProjectDayStat, StatisticsFilter},
};
use ::entity::{
    projects::Entity as Project,
    sessions::{
        Column as SessionColumn, Entity as Session, Model as SessionModel,
        Relation as SessionRelation,
    },
    sessions_tags::Relation as SessionTagRelation,
    tags::Column as TagColumn,
};

pub struct StatisticsRepository<'a> {
    db: &'a DatabaseConnection,
}

impl<'a> StatisticsRepository<'a> {
    pub fn new(db: &'a DatabaseConnection) -> Self {
        Self { db }
    }

    pub async fn get_statistics(
        &self,
        statistics_filter: StatisticsFilter,
    ) -> Result<Vec<DayStat>, DbErr> {
        let StatisticsFilter {
            start_date,
            end_date,
            project_ids,
            tag_ids,
        } = statistics_filter;

        let mut query = Session::find()
            .filter(SessionColumn::Date.gte(start_date))
            .filter(SessionColumn::Date.lte(end_date));

        if let Some(pids) = project_ids {
            query = query.filter(SessionColumn::ProjectId.is_in(pids));
        }

        if let Some(tids) = tag_ids {
            query = query
                .join(JoinType::InnerJoin, SessionRelation::SessionsTags.def())
                .join(JoinType::InnerJoin, SessionTagRelation::Tags.def())
                .filter(TagColumn::Id.is_in(tids))
                .distinct_on([SessionColumn::Id]);
        }

        let all_sessions = query.all(self.db).await?;

        // Step 2: Group by day
        let mut day_map: BTreeMap<NaiveDateTime, Vec<SessionModel>> = BTreeMap::new();

        for session in all_sessions {
            let date = session.date;
            day_map.entry(date).or_default().push(session);
        }

        let mut result = Vec::new();

        // Step 3: For each day, group by project
        for (date, sessions_on_day) in day_map {
            let mut project_map: HashMap<i32, (MinimalProjectModel, i64)> = HashMap::new();

            for session in &sessions_on_day {
                let duration = session.session_duration_sec as i64;

                if let Some((_, total)) = project_map.get_mut(&session.project_id) {
                    *total += duration;
                } else {
                    // You might want to batch fetch all projects ahead of time for performance
                    let project = Project::find_by_id(session.project_id)
                        .one(self.db)
                        .await?
                        .ok_or(DbErr::Custom(format!(
                            "Project not found: {}",
                            session.project_id
                        )))?;

                    project_map.insert(
                        session.project_id,
                        (MinimalProjectModel::from(project), duration),
                    );
                }
            }

            let mut projects = Vec::new();
            let mut day_total = 0;

            for (_pid, (project, total)) in project_map {
                day_total += total;
                projects.push(ProjectDayStat {
                    project,
                    total_seconds: total,
                });
            }

            result.push(DayStat {
                date,
                projects,
                total_seconds: day_total,
            });
        }

        Ok(result)
    }
}
