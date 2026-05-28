# Sentinel Fraud API

API do Sentinel responsável por autenticação, gestão de usuários, transações, auditoria, dashboard e notificações em tempo real.

## Tecnologias

- Python 3.13
- FastAPI
- SQLAlchemy + Alembic
- PostgreSQL
- Redis
- RabbitMQ

## Requisitos

- Python 3.13+
- pip
- PostgreSQL (para execução local fora do Docker)

## Executar localmente

```bash
pip install -r requirements.txt
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

API disponível em `http://localhost:8000`.

## Variáveis de ambiente

Configure um arquivo `.env` com os campos obrigatórios:

- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`
- `JWT_SECRET_KEY`
- `JWT_ALGORITHM`
- `JWT_ACCESS_TOKEN_EXPIRE_MINUTES`

Para staging, utilize o template:

- `sentinel-fraud-api/.env.staging.example`

## Docker

Build da imagem da API:

```bash
docker build -t sentinel-fraud-api .
```
