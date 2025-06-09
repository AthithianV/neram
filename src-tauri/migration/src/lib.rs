pub use sea_orm;
pub use sea_orm_migration::prelude::*;

mod m20250605_000001_create_journal_table;
mod m20250605_000001_create_pomodaro_table;
mod m20250605_000001_create_settings_table;
mod m20250605_000001_create_tag_table;
mod m20250605_000001_create_task_table;
mod m20250605_000001_create_workunit_table;
mod m20250605_000001_create_workunit_tag_table;

pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20250605_000001_create_journal_table::Migration),
            Box::new(m20250605_000001_create_pomodaro_table::Migration),
            Box::new(m20250605_000001_create_settings_table::Migration),
            Box::new(m20250605_000001_create_tag_table::Migration),
            Box::new(m20250605_000001_create_task_table::Migration),
            Box::new(m20250605_000001_create_workunit_table::Migration),
            Box::new(m20250605_000001_create_workunit_tag_table::Migration)
        ]
    }
}
