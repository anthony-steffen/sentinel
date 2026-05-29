# Sentinel Fraud Platform

Sentinel e uma plataforma full stack para monitoramento antifraude com dashboard analitico, trilha de auditoria, RBAC e notificacoes em tempo real.

Projeto desenvolvido com foco em:

- arquitetura limpa e evolutiva
- seguranca de acesso e rastreabilidade
- experiencia de operacao para times analiticos
- demonstracao tecnica pronta para recrutadores

## Highlights tecnicos

- Dashboard analitico com KPI cards, charts e filtros operacionais
- Pipeline de transacoes com score de risco e sinais de fraude
- RBAC por perfil (`ADMIN`, `ANALYST`, `OPERATOR`)
- Auditoria de eventos sensiveis (login, revisao, aprovacoes, rejeicoes)
- Realtime para notificacoes via WebSocket
- Infra Docker para API, web e dependencias
- Fluxo de demo publica sem custo via tunel temporario

## Arquitetura

Camadas principais:

1. `sentinel-fraud-web` (React + Vite + TanStack Query + Zustand)
2. `sentinel-fraud-api` (FastAPI + SQLAlchemy + Alembic)
3. `postgres` para persistencia
4. `redis` e `rabbitmq` preparados para cenarios de mensageria e escala

Documentacao por modulo:

- API: [sentinel-fraud-api/README.md](sentinel-fraud-api/README.md)
- Web: [sentinel-fraud-web/README.md](sentinel-fraud-web/README.md)
- Staging: [infra/staging/README.md](infra/staging/README.md)
- Demo publica: [infra/demo/README.md](infra/demo/README.md)

## Demo para recrutadores

Fluxo recomendado (sem custo de hospedagem):

1. Subir stack local
2. Abrir link publico temporario
3. Compartilhar URL + credenciais demo

No Git Bash:

```bash
bash ./infra/demo/start-public-demo.sh
```

No PowerShell:

```powershell
.\infra\demo\start-public-demo.ps1
```

## Credenciais demo (validadas)

Senha para todas as contas:

- `SentinelDemo@2026`

Contas:

1. `demo.admin@sentinel-demo.com` (`ADMIN`)
2. `demo.analyst@sentinel-demo.com` (`ANALYST`)
3. `demo.operator@sentinel-demo.com` (`OPERATOR`)

## Fluxos recomendados de avaliacao

1. Login com `ADMIN` e revisar dashboard + transacoes + auditoria
2. Login com `ANALYST` e validar operacao analitica
3. Login com `OPERATOR` e validar escopo de acesso restrito
4. Simular criacao/revisao de transacao e observar atualizacao de estado

## Seguranca e governanca

- JWT access/refresh
- Rate limiting para login e transacoes
- RBAC no backend e no frontend
- Audit logs para acoes criticas
- Separacao de ambientes por variaveis e compose dedicado

## Roadmap atual

- Dia 10: Analytics + tables + transaction details (concluido)
- Dia 11: Realtime + notifications (concluido)
- Dia 12: RBAC + security + UX polish (concluido)
- Dia 13: Docker + infra + deploy staging (concluido)
- Dia 14: Deploy producao + CI/CD (pendente)
- Dia 15: README premium + documentacao final (em finalizacao)

## Materiais para portfolio

- Kit de publicacao no LinkedIn: [docs/portfolio/linkedin-kit.md](docs/portfolio/linkedin-kit.md)
- Guia para destaque no GitHub: [docs/portfolio/github-showcase.md](docs/portfolio/github-showcase.md)
- Roteiro de video end-to-end: [docs/portfolio/video-runbook.md](docs/portfolio/video-runbook.md)
