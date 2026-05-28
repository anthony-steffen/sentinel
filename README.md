# Sentinel Fraud Platform

Plataforma full stack para monitoramento e analise de fraude, com dashboard, transacoes, RBAC e notificacoes em tempo real.

## Acesso rapido para recrutadores

Fluxo recomendado (sem custo de hospedagem):

1. Subir stack local com Docker.
2. Abrir link publico (temporario ou fixo).
3. Testar com credenciais demo.

Guia completo:

- [infra/demo/README.md](infra/demo/README.md)

Opcao de URL fixa:

- `Cloudflare Tunnel` com subdominio fixo + token `CLOUDFLARED_TUNNEL_TOKEN`
- script pronto: `.\infra\demo\start-fixed-public-demo.ps1`
- inicializacao automatica no logon: `.\infra\demo\register-startup-task.ps1`

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
