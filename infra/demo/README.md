# Demo publica para recrutadores (sem custo)

Este fluxo usa Docker local + tunel SSH temporario para compartilhar a aplicacao sem pagar hospedagem.

## 1) Subir a stack local

```powershell
.\infra\demo\start-demo.ps1
```

O script:

- cria `.env.staging` e `sentinel-fraud-api/.env.staging` a partir dos templates (se nao existirem)
- sobe os containers com `docker compose`
- executa health check da Web e da API
- recria usuarios demo para recrutadores (com senha conhecida e perfis corretos)

## 2) Abrir link publico temporario

```powershell
.\infra\demo\open-public-link.ps1
```

Quando o comando iniciar, ele exibira uma URL publica HTTPS. Compartilhe essa URL com recrutadores.

Importante:

- mantenha o terminal do tunel aberto
- mantenha o computador ligado e com internet
- se o terminal fechar, o link cai

## 3) Encerrar demo

```powershell
.\infra\demo\stop-demo.ps1
```

## 4) Dicas para reduzir risco em avaliacao

- envie junto as credenciais demo abaixo
- marque janela de teste (ex: 14:00-18:00)
- deixe este roteiro no README principal do projeto

## 5) Credenciais demo para recrutadores

Senha para todas as contas:

- `SentinelDemo@2026`

Contas:

- `demo.admin@sentinel-demo.com` (`ADMIN`)
- `demo.analyst@sentinel-demo.com` (`ANALYST`)
- `demo.operator@sentinel-demo.com` (`OPERATOR`)

## 6) Janela de avaliacao (o que significa)

Janela de avaliacao e o periodo em que voce garante que o ambiente estara online para teste.
Exemplo: "Disponivel hoje das 14:00 as 18:00 (UTC-3)".

Como o link depende do seu computador local, fora dessa janela pode ficar indisponivel.

## 7) Rotacao de senha apos entrevista

Para recriar as contas demo com senha atual:

```powershell
.\infra\demo\reset-demo-users.ps1
```

Para trocar a senha, informe um novo valor:

```powershell
.\infra\demo\reset-demo-users.ps1 -DemoPassword "NovaSenhaForte@2026"
```
