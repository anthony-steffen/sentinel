# Staging Deploy Guide

## 1) Prepare environment files

Copy the templates and adjust values:

```powershell
Copy-Item .env.staging.example .env.staging
Copy-Item sentinel-fraud-api/.env.staging.example sentinel-fraud-api/.env.staging
```

## 2) Deploy staging stack

```powershell
.\infra\staging\deploy.ps1
```

This command builds and starts:

- `web` (nginx + static React build)
- `api` (FastAPI)
- `postgres`
- `redis`
- `rabbitmq`

## 3) Run smoke test

```powershell
.\infra\staging\smoke-test.ps1
```

Default URLs:

- Web: `http://localhost:8080`
- API health: `http://localhost:8000/health`

## 4) Useful operations

```powershell
docker compose --env-file .env.staging -f docker-compose.staging.yml ps
docker compose --env-file .env.staging -f docker-compose.staging.yml logs -f api
docker compose --env-file .env.staging -f docker-compose.staging.yml down
```
