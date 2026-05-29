# Sentinel Fraud Web

Frontend do Sentinel para monitoramento de fraude, com foco em operacao analitica, revisao de transacoes e notificacoes em tempo real.

![React](https://img.shields.io/badge/React-UI-20232a?style=for-the-badge&logo=react&logoColor=61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-build-646CFF?style=for-the-badge&logo=vite&logoColor=white)

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

Aplicacao disponivel em `http://localhost:5173`.

## Build de producao

```bash
npm run build
npm run preview
```

## Variaveis de ambiente

- `VITE_API_BASE_URL`: URL base da API REST.
- `VITE_WS_BASE_URL`: URL base do WebSocket de notificacoes.

Exemplo de staging:

```env
VITE_API_BASE_URL=/api
VITE_WS_BASE_URL=ws://localhost:8080/notifications/ws
```

## Acesso publico para testes

Para acesso publico sem custo e credenciais demo validadas, use:

- [infra/demo/README.md](../infra/demo/README.md)
