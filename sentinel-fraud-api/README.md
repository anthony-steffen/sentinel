# Sentinel Fraud API

API do Sentinel responsavel por autenticacao, gestao de usuarios, transacoes, auditoria, dashboard e notificacoes em tempo real.

![FastAPI](https://img.shields.io/badge/FastAPI-API-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-ready-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-ready-0db7ed?style=for-the-badge&logo=docker&logoColor=white)

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
- PostgreSQL (para execucao local fora do Docker)

## Executar localmente

```bash
pip install -r requirements.txt
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

API disponivel em `http://localhost:8000`.

## Variaveis de ambiente

Configure um arquivo `.env` com os campos obrigatorios:

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

## Credenciais demo para testar a aplicacao

As contas demo oficiais ficam no fluxo de [infra/demo/README.md](../infra/demo/README.md).

Resumo rapido:

- senha: `SentinelDemo@2026`
- `demo.admin@sentinel-demo.com` (`ADMIN`)
- `demo.analyst@sentinel-demo.com` (`ANALYST`)
- `demo.operator@sentinel-demo.com` (`OPERATOR`)
