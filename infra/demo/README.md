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

## 3) URL fixa (recomendado)

Para nao depender de URL aleatoria a cada sessao, use Cloudflare Tunnel com subdominio fixo.

Requisito minimo:

- dominio configurado no Cloudflare
- tunnel criado no painel do Cloudflare
- token do tunnel (CLOUDFLARED_TUNNEL_TOKEN)

Uso:

```powershell
$env:CLOUDFLARED_TUNNEL_TOKEN = "<SEU_TOKEN>"
.\infra\demo\start-fixed-public-demo.ps1
```

Esse comando sobe a stack local e abre o tunel com URL fixa (a definida no Cloudflare, por exemplo `demo.seudominio.com`).

## 4) Encerrar demo

```powershell
.\infra\demo\stop-demo.ps1
```

## 5) Inicializacao automatica no Windows (Task Scheduler)

1. Defina o token do Cloudflare no Windows:

```powershell
setx CLOUDFLARED_TUNNEL_TOKEN "<SEU_TOKEN>"
```

2. Feche e abra o PowerShell.

3. Registre a tarefa automatica:

```powershell
.\infra\demo\register-startup-task.ps1
```

4. Inicie sem reiniciar (opcional):

```powershell
Start-ScheduledTask -TaskName "SentinelFixedDemoTunnel"
```

5. Verifique status:

```powershell
Get-ScheduledTask -TaskName "SentinelFixedDemoTunnel"
```

6. Verifique logs do launcher:

```powershell
Get-Content .\infra\demo\logs\startup.log -Tail 100
```

Para remover a automacao:

```powershell
.\infra\demo\unregister-startup-task.ps1
```

## 6) Dicas para reduzir risco em avaliacao

- envie junto as credenciais demo abaixo
- marque janela de teste (ex: 14:00-18:00)
- deixe este roteiro no README principal do projeto

## 7) Credenciais demo para recrutadores

Senha para todas as contas:

- `SentinelDemo@2026`

Contas:

- `demo.admin@sentinel-demo.com` (`ADMIN`)
- `demo.analyst@sentinel-demo.com` (`ANALYST`)
- `demo.operator@sentinel-demo.com` (`OPERATOR`)

## 8) Janela de avaliacao (o que significa)

Janela de avaliacao e o periodo em que voce garante que o ambiente estara online para teste.
Exemplo: "Disponivel hoje das 14:00 as 18:00 (UTC-3)".

Como o link depende do seu computador local, fora dessa janela pode ficar indisponivel.

## 9) Rotacao de senha apos entrevista

Para recriar as contas demo com senha atual:

```powershell
.\infra\demo\reset-demo-users.ps1
```

Para trocar a senha, informe um novo valor:

```powershell
.\infra\demo\reset-demo-users.ps1 -DemoPassword "NovaSenhaForte@2026"
```
