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

- envie junto um usuario demo pronto (email/senha)
- marque janela de teste (ex: 14:00-18:00)
- deixe este roteiro no README principal do projeto
