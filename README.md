# Sentinel Fraud Platform

Plataforma full stack para monitoramento e analise de fraude, com dashboard, transacoes, RBAC e notificacoes em tempo real.

## Acesso rapido para recrutadores

Fluxo recomendado (sem custo de hospedagem):

1. Subir stack local com Docker.
2. Abrir link publico temporario (`localhost.run`).
3. Testar com credenciais demo.

Atalho para Git Bash:

```bash
bash ./infra/demo/start-public-demo.sh
```

Guia completo:

- [infra/demo/README.md](infra/demo/README.md)

## Credenciais demo (validadas)

Senha para todas as contas:

- `SentinelDemo@2026`

Contas:

- `demo.admin@sentinel-demo.com` (`ADMIN`)
- `demo.analyst@sentinel-demo.com` (`ANALYST`)
- `demo.operator@sentinel-demo.com` (`OPERATOR`)

## Estrutura do projeto

- API: [sentinel-fraud-api/README.md](sentinel-fraud-api/README.md)
- Web: [sentinel-fraud-web/README.md](sentinel-fraud-web/README.md)
- Staging: [infra/staging/README.md](infra/staging/README.md)
- Demo publica: [infra/demo/README.md](infra/demo/README.md)
