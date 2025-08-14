use sea_orm::{ConnectOptions, Database};
use std::time::Duration;

use neram_lib::repository::task::TaskRepository;
use tracing::log::LevelFilter; // bring Level into scope

#[tokio::test]
async fn test_find_all_by_project_id() {
    let mut opt = ConnectOptions::new("sqlite://../db/neram.db?mode=rwc".to_owned());
    opt.sqlx_logging(true)
        .sqlx_logging_level(LevelFilter::Debug) // DEBUG in uppercase
        .connect_timeout(Duration::from_secs(5));

    let db = Database::connect(opt).await.unwrap();

    // Create repo instance (assuming you have a constructor or use directly if methods are static)
    let repo = TaskRepository::new(&db);
    let result = repo
        .find_all(Some(1), Some("To Do".to_string()))
        .await
        .unwrap();

    println!("{:#?}", result);
}
