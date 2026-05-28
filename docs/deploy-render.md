# Deploy no Render

Este guia descreve o deploy gratuito do Sentinel no Render usando:

- 1 Web Service para a API FastAPI
- 1 Static Site para o frontend React
- 1 banco Render Postgres

## 1) Pré-requisitos

- Repositório publicado no GitHub.
- Conta no Render conectada ao GitHub.
- Branch principal atualizada com o arquivo `render.yaml`.

## 2) Criar o Blueprint

No Render:

1. Acesse o dashboard.
2. Clique em `New`.
3. Selecione `Blueprint`.
4. Escolha o repositório do Sentinel.
5. Confirme o arquivo `render.yaml` na raiz.
6. Clique para criar os serviços.

O Blueprint deve criar:

- `sentinel-fraud-api`
- `sentinel-fraud-web`
- `sentinel-fraud-db`

## 3) Conferir URLs geradas

Depois do primeiro deploy, confira as URLs reais:

- API: normalmente `https://sentinel-fraud-api.onrender.com`
- Web: normalmente `https://sentinel-fraud-web.onrender.com`

Se o Render gerar URLs diferentes, atualize:

Na API:

```env
CORS_ALLOWED_ORIGINS=https://URL-REAL-DO-FRONTEND.onrender.com
```

No frontend:

```env
VITE_API_BASE_URL=https://URL-REAL-DA-API.onrender.com
VITE_WS_BASE_URL=wss://URL-REAL-DA-API.onrender.com/notifications/ws
```

Depois disso, redeploy a API e o frontend.

## 4) Validar API

Abra:

```text
https://URL-REAL-DA-API.onrender.com/health
```

Resposta esperada:

```json
{
  "status": "ok"
}
```

## 5) Validar frontend

Abra a URL do frontend e valide:

- login
- dashboard
- listagem de transações
- notificações em tempo real
- rotas protegidas por perfil

## 6) Observações sobre o plano gratuito

- O Web Service gratuito pode entrar em sleep após inatividade.
- O primeiro acesso após sleep pode demorar alguns segundos.
- O banco gratuito tem limitações de armazenamento e retenção.
- Para apresentação a recrutadores, deixe uma conta demo documentada no README principal.

## 7) Troubleshooting rápido

Erro de CORS:

- Confirme se `CORS_ALLOWED_ORIGINS` contém exatamente a URL do frontend.
- Use `https`, não `http`.
- Não deixe barra final na URL.

Frontend chamando API errada:

- Confirme `VITE_API_BASE_URL`.
- Faça redeploy do Static Site, pois variáveis `VITE_*` entram no build.

WebSocket não conecta:

- Confirme `VITE_WS_BASE_URL`.
- Use `wss://` em produção.
- Confira se a URL termina em `/notifications/ws`.

Erro de banco:

- Confirme se `DATABASE_URL` foi preenchida pelo Blueprint.
- Confira os logs da API.
- Garanta que o pre-deploy command `alembic upgrade head` rodou sem erro.
