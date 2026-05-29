# Roteiro de Video - Sentinel Fraud Platform (End-to-End)

Objetivo: gravar um video curto (4 a 6 minutos) mostrando produto, arquitetura e fluxo operacional de ponta a ponta.

## Setup antes de gravar

1. Subir demo:

```bash
bash ./infra/demo/start-public-demo.sh
```

2. Confirmar:

- login funcionando nas 3 contas demo
- dashboard carregando
- rotas protegidas ativas

3. Preparar navegador:

- zoom 100%
- sem abas extras
- modo tela limpa

## Estrutura do video (timeline sugerida)

## 0:00 - 0:25 | Abertura

Fala sugerida:

"Este e o Sentinel Fraud Platform, um sistema full stack para monitoramento antifraude com dashboard analitico, trilha de auditoria, RBAC e notificacoes em tempo real."

Na tela:

- dashboard carregada
- breve pan pelas secoes principais

## 0:25 - 1:10 | Login e papeis

Fala sugerida:

"Aqui eu valido controle de acesso por perfil. Tenho contas demo para ADMIN, ANALYST e OPERATOR."

Na tela:

1. login com `demo.admin@sentinel-demo.com`
2. abrir menu lateral e mostrar rotas disponiveis

## 1:10 - 2:10 | Dashboard e analitico

Fala sugerida:

"No dashboard, os KPIs trazem volume, taxa de fraude e risco medio, com graficos de distribuicao e tendencia para apoio a decisao."

Na tela:

1. rolar cards e charts
2. destacar status realtime

## 2:10 - 3:10 | Transacoes e review queue

Fala sugerida:

"A camada transacional permite filtrar, ordenar e revisar operacoes suspeitas com sinais de fraude e contexto tecnico."

Na tela:

1. abrir `Transactions`
2. aplicar busca/filtro
3. abrir detalhe de transacao
4. abrir `Review Queue`

## 3:10 - 3:45 | Audit logs e seguranca

Fala sugerida:

"Toda acao critica fica registrada em auditoria para rastreabilidade, incluindo login, revisao, aprovacao e rejeicao."

Na tela:

1. abrir `Audit Logs`
2. mostrar eventos recentes

## 3:45 - 4:35 | Validacao de RBAC

Fala sugerida:

"Agora valido a diferenca de escopo entre perfis para garantir governanca."

Na tela:

1. logout
2. login com `demo.operator@sentinel-demo.com`
3. mostrar rotas disponiveis e comportamento de acesso negado quando aplicavel

## 4:35 - 5:15 | Infra e encerramento

Fala sugerida:

"A aplicacao roda em stack Docker e pode ser publicada em demo temporaria para avaliacao tecnica."

Na tela:

1. terminal com scripts de demo
2. fechar com README e links de docs

## Script de fala (versao curta para legenda)

```text
Sentinel e uma plataforma full stack de monitoramento antifraude.
Ela combina dashboard analitico, pipeline de transacoes, controle de acesso por papel e trilha de auditoria.
No fluxo de demo, eu valido o comportamento por perfil e a operacao fim a fim da aplicacao.
```

## Checklist de qualidade

1. Audio limpo e sem ruido
2. Cursor visivel e movimentos lentos
3. Texto legivel no mobile e desktop
4. Duracao maxima de 6 minutos
5. Fechar com call to action (feedback ou contato)

## Publicacao recomendada

1. Subir video no LinkedIn nativo
2. Anexar no README via link
3. Usar o mesmo roteiro para entrevistas tecnicas ao vivo
