# Sentinel Fraud Platform

Plataforma full stack para monitoramento antifraude com dashboard analitico, trilha de auditoria, RBAC e notificacoes em tempo real.

![Status](https://img.shields.io/badge/status-active-0a7ea4?style=for-the-badge)
![Backend](https://img.shields.io/badge/backend-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Frontend](https://img.shields.io/badge/frontend-React-20232a?style=for-the-badge&logo=react&logoColor=61dafb)
![Database](https://img.shields.io/badge/database-PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![Infra](https://img.shields.io/badge/infra-Docker-0db7ed?style=for-the-badge&logo=docker&logoColor=white)

## Visao geral

- Dashboard com KPIs, distribuicoes e tendencia operacional
- Pipeline de transacoes com score de risco e sinais de fraude
- Controle de acesso por perfil (`ADMIN`, `ANALYST`, `OPERATOR`)
- Auditoria de eventos criticos
- Notificacoes em tempo real via WebSocket
- Execucao local e de staging com Docker

## Arquitetura

Componentes principais:

1. `sentinel-fraud-web` (React + TypeScript + Vite)
2. `sentinel-fraud-api` (FastAPI + SQLAlchemy + Alembic)
3. `postgres` (persistencia)
4. `redis` e `rabbitmq` (componentes de suporte de mensageria/cache)

Documentacao por modulo:

- API: [sentinel-fraud-api/README.md](sentinel-fraud-api/README.md)
- Web: [sentinel-fraud-web/README.md](sentinel-fraud-web/README.md)
- Staging: [infra/staging/README.md](infra/staging/README.md)
- Demo publica: [infra/demo/README.md](infra/demo/README.md)
- Guia E2E com capturas reais: [docs/guia-e2e.md](docs/guia-e2e.md)

## Execucao rapida da demo publica

Git Bash:

```bash
bash ./infra/demo/start-public-demo.sh
```

PowerShell:

```powershell
.\infra\demo\start-public-demo.ps1
```

## Credenciais demo para testar a aplicacao

Senha para todas as contas:

- `SentinelDemo@2026`

Contas:

1. `demo.admin@sentinel-demo.com` (`ADMIN`)
2. `demo.analyst@sentinel-demo.com` (`ANALYST`)
3. `demo.operator@sentinel-demo.com` (`OPERATOR`)

## Fluxo visual E2E

Capturas reais do fluxo completo de uso:

1. Login
2. Registro de usuario via API
3. Criacao de transacao via API
4. Dashboard + Transactions + Review Queue + Audit Logs
5. Validacao de RBAC

Guia completo: [docs/guia-e2e.md](docs/guia-e2e.md)

![Dashboard](docs/assets/e2e/05-dashboard-admin.png)
![Transactions](docs/assets/e2e/06-transactions-table.png)
![Review Queue](docs/assets/e2e/08-review-queue.png)

## Seguranca

- JWT access/refresh
- Rate limiting para login e transacoes
- RBAC no backend e no frontend
- Audit logs para acoes criticas

## Licenca

Este projeto esta licenciado sob a Apache License 2.0.
Consulte o arquivo [LICENSE](LICENSE).
