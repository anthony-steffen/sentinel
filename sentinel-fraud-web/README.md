# Sentinel Fraud Web

Frontend do Sentinel para monitoramento de fraude, com foco em operação analítica, revisão de transações e notificações em tempo real.

## Tecnologias

- React + TypeScript
- Vite
- TanStack Query
- Zustand
- Tailwind CSS + DaisyUI

## Requisitos

- Node.js 22+
- npm 10+

## Executar localmente

```bash
npm install
npm run dev
```

Aplicação disponível em `http://localhost:5173`.

## Build de produção

```bash
npm run build
npm run preview
```

## Variáveis de ambiente

- `VITE_API_BASE_URL`: URL base da API REST.
- `VITE_WS_BASE_URL`: URL base do WebSocket de notificações.

Exemplo de staging:

```env
VITE_API_BASE_URL=/api
VITE_WS_BASE_URL=ws://localhost:8080/notifications/ws
```
