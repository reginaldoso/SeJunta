$ErrorActionPreference = 'Stop'
Write-Host "Starting PostGIS container..."
docker-compose up -d db

$cid = (docker-compose ps -q db).Trim()
if (-not $cid) {
  Write-Error "Could not find db container. Ensure docker-compose is available and the compose file is in this folder."
  exit 1
}

Write-Host "Copying init.sql into container..."
docker cp "sj-backend/db/init.sql" $cid:/init.sql

Write-Host "Applying init.sql inside container..."
docker exec -i $cid bash -lc "PGPASSWORD=sjpass psql -U sj -d sjdb -f /init.sql"

Write-Host "Database initialization complete."
