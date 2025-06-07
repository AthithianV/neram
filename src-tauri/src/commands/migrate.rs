use migration::sea_orm::{Database, DatabaseConnection, DbErr};
use migration::MigratorTrait;

pub async fn setup_db(path: &str) -> Result<DatabaseConnection, DbErr> {
    println!("Setting up database at {}", path);
    let conn = Database::connect(path).await?;

    println!("Running migrations");
    migration::Migrator::up(&conn, None).await?;

    println!("Migrations complete");
    Ok(conn)
}
