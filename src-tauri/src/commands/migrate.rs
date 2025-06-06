use migration::{MigratorTrait};
use migration::sea_orm::{Database, DatabaseConnection, DbErr};

pub async fn setup_db(path: &str) -> Result<DatabaseConnection, DbErr> {
    let db_url = format!("sqlite://{}/neram.db?mode=rwc", path);
    let conn = Database::connect(&db_url).await?;

    migration::Migrator::up(&conn, None).await?;

    Ok(conn)
}
