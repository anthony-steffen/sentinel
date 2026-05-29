# Demo publica (sem custo)

Este fluxo usa Docker local + tunel SSH temporario para disponibilizar a aplicacao por URL publica.

![Demo](https://img.shields.io/badge/demo-localhost.run-2d6cdf?style=for-the-badge)
![No Card](https://img.shields.io/badge/sem%20cartao-100%25-2f855a?style=for-the-badge)

## 1) Subir stack + abrir link publico (comando unico)

No PowerShell:

```powershell
.\infra\demo\start-public-demo.ps1
```

No Git Bash (MINGW64):

```bash
bash ./infra/demo/start-public-demo.sh
```

O script:

- cria `.env.staging` e `sentinel-fraud-api/.env.staging` a partir dos templates (se nao existirem)
- sobe os containers com `docker compose`
- aplica migracoes do banco (`alembic upgrade head`)
- executa health check da Web e da API
- recria usuarios demo com senha conhecida e perfis corretos
- abre tunel temporario no `localhost.run`

## 2) Fluxo manual (alternativo)

```powershell
.\infra\demo\start-demo.ps1
.\infra\demo\open-public-link.ps1
```

Quando o comando iniciar, ele exibira uma URL publica HTTPS.

Importante:

- mantenha o terminal do tunel aberto
- mantenha o computador ligado e com internet
- se o terminal fechar, o link cai
- se a URL cair, rode novamente `start-public-demo`

## 3) Encerrar demo

No PowerShell:

```powershell
.\infra\demo\stop-demo.ps1
```

No Git Bash (MINGW64):

```bash
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "$(cygpath -w ./infra/demo/stop-demo.ps1)"
```

## 4) Boas praticas operacionais

- execute o comando poucos minutos antes da sessao de teste
- mantenha o terminal do tunel aberto durante todo o uso
- valide login e dashboard antes de compartilhar a URL

## 5) Credenciais demo para testar a aplicacao

Senha para todas as contas:

- `SentinelDemo@2026`

Contas:

- `demo.admin@sentinel-demo.com` (`ADMIN`)
- `demo.analyst@sentinel-demo.com` (`ANALYST`)
- `demo.operator@sentinel-demo.com` (`OPERATOR`)

## 6) Janela de disponibilidade

Janela de disponibilidade: Periodo no qual é garantido que o ambiente estara online para teste.
Das 14:00 as 18:00 (UTC-3)".

## 7) Rotacao de senha

Para recriar as contas demo com senha atual:

```powershell
.\infra\demo\reset-demo-users.ps1
```

Para trocar a senha, informe um novo valor:

```powershell
.\infra\demo\reset-demo-users.ps1 -DemoPassword "NovaSenhaForte@2026"
```

## 8) Guia visual E2E

Para validacao completa (API + frontend + RBAC) com capturas reais, consulte:

- `docs/guia-e2e.md`
