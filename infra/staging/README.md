# Guia de Deploy em Staging

## 1) Preparar arquivos de ambiente

Copie os templates e ajuste os valores:

```powershell
Copy-Item .env.staging.example .env.staging
Copy-Item sentinel-fraud-api/.env.staging.example sentinel-fraud-api/.env.staging
```

## 2) Subir o ambiente de staging

```powershell
.\infra\staging\deploy.ps1
```

Esse comando faz build e inicia:

- `web` (nginx + build estático React)
- `api` (FastAPI)
- `postgres`
- `redis`
- `rabbitmq`

## 3) Executar smoke test

```powershell
.\infra\staging\smoke-test.ps1
```

URLs padrão:

- Web: `http://localhost:8080`
- Health da API: `http://localhost:8000/health`

## 4) Operações úteis

```powershell
docker compose --env-file .env.staging -f docker-compose.staging.yml ps
docker compose --env-file .env.staging -f docker-compose.staging.yml logs -f api
docker compose --env-file .env.staging -f docker-compose.staging.yml down
```
