use chrono::{NaiveDateTime, Timelike, Utc};
pub use sea_orm;
pub use sea_orm_migration::prelude::*;

mod m20250605_000001_create_pomodaro_table;
mod m20250605_000001_create_settings_table;
mod m20250605_000001_create_tag_table;
mod m20250605_000001_create_task_table;
mod m20250605_000002_create_projects_table;
mod m20250605_000003_create_sessions_table;
mod m20250605_000004_create_pivot_tables;

pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20250605_000001_create_tag_table::Migration),
            Box::new(m20250605_000002_create_projects_table::Migration),
            Box::new(m20250605_000001_create_task_table::Migration),
            Box::new(m20250605_000003_create_sessions_table::Migration),
            Box::new(m20250605_000004_create_pivot_tables::Migration),
            Box::new(m20250605_000001_create_pomodaro_table::Migration),
            Box::new(m20250605_000001_create_settings_table::Migration),
        ]
    }
}

pub fn now() -> NaiveDateTime {
    Utc::now().naive_local().with_nanosecond(0).unwrap()
}
