# SECURITY.md

## Objetivo
Definir controles de seguranca para o monorepo com arquitetura `Frontend (Pages) -> Proxy (Workers) -> Backend (Lambda URL)`.

## Fonte de Verdade
- Este arquivo centraliza requisitos de seguranca, privacidade e compliance.

## Principios
- Defense in Depth
- Least Privilege
- Fail Secure
- Privacy by Design

## Controles Obrigatorios
- Validacao de entrada no backend com `zod`.
- Sessao curta com cookie `httpOnly`, `secure`, `sameSite=lax` quando aplicavel.
- Idempotency key para operacoes sensiveis ou reprocessaveis.
- Rate limit e controles anti-automacao no proxy e no backend.
- TLS em transito e criptografia em repouso.
- Backend so processa chamadas autenticadas pelo Workers.

## Fronteira de Seguranca por Camada

### Frontend (`frontend/` - Cloudflare Pages)
- Proibido armazenar secrets no bundle.
- Proibido consumir backend/Lambda diretamente.
- Proibido consumir API externa diretamente.
- Proibido implementar regra critica de negocio no client.
- Evitar `localStorage` para dados sensiveis.
- Exibir erros amigaveis sem detalhes internos de stack/infra.

### Proxy (`proxy/` - Cloudflare Workers)
- Ponto obrigatorio de entrada das requisicoes do frontend.
- Validar bearer token recebido do frontend.
- Assinar header de autenticacao para o backend com chave privada do Workers.
- Encaminhar requisicoes apenas para destinos allowlist (Lambda URLs autorizadas).
- Aplicar rate limit, anti-automacao e correlation id.

### Backend (`backend/` - Lambda URL)
- Validar assinatura do header enviado pelo Workers com chave publica confiavel.
- Rejeitar qualquer chamada sem assinatura valida, expirada ou fora de escopo.
- Validar payload de entrada na borda com `zod`.
- Concentrar autorizacao de dominio, regras de negocio e acesso a TursoDB/APIs externas.
- Sanitizar logs e padronizar tratamento de erro.

## Autenticacao Workers -> Backend (Obrigatoria)
- O Workers assina um token/header interno com chave privada server-side.
- O backend valida assinatura com chave publica correspondente.
- Claims obrigatorias: `iss`, `aud`, `sub`, `jti`, `iat`, `exp`, `scope`.
- O `aud` deve identificar explicitamente o backend alvo.
- TTL curto (ex.: segundos/minutos), configurado por env.
- Implementar mitigacao de replay com `jti` + janela curta de validade.
- Respostas padrao:
  - `401` para assinatura/token ausente, invalido ou expirado.
  - `403` para escopo, emissor ou audience sem permissao.

## Protecao de Dados
- Nunca logar dados cadastrais completos, token ou secret.
- Redigir PII em logs e eventos.
- Minimizar coleta e retencao de dados.
- Aplicar mascaramento de dados sensiveis antes de resposta quando necessario.

## Integracoes Externas e Banco
- Chamadas externas ocorrem somente no backend.
- Acesso ao TursoDB ocorre somente no backend.
- Schema e migrations do banco ficam centralizados no backend com Drizzle.
- Secrets somente em cofre gerenciado (Secrets Manager/Vault equivalente).
- Autenticacao servidor-servidor (OAuth2 client credentials, HMAC ou mTLS).
- Definir timeout, retry com backoff e circuito de falha.
- Validar contrato de resposta e tratar erros de forma deterministica.

## Governanca de Migrations (Banco)
- Migrations devem ser versionadas e rastreaveis.
- Em producao, migrations rodam por etapa explicita de pipeline/deploy (nunca implicitas no runtime de requisicao).
- Em desenvolvimento local, auto-migrate so com flag de ambiente explicita.
- Credenciais de migration devem seguir principio de menor privilegio e nao podem ser expostas em logs.
- Mudancas destrutivas exigem plano de rollback e estrategia de compatibilidade.

## Upload de Arquivos
- Formatos permitidos: `pdf`, `jpg`, `jpeg`, `png`, `csv`, `xls`, `xlsx`.
- Validar MIME e assinatura de arquivo.
- Aplicar limite de tamanho por tipo.
- Bloquear extensoes ou assinaturas nao permitidas.

## Configuracao e Segredos
- Configuracao publica do frontend deve vir de endpoint controlado no proxy/backend.
- Chave privada de assinatura fica somente no Workers.
- Chave publica de validacao fica no backend.
- Variaveis sensiveis devem existir apenas em Workers/backend, com validacao e tipagem centralizadas.
- Rotacao de chaves/secrets deve ser suportada sem alteracao de codigo de feature.

## Observabilidade Segura
- Logs estruturados sem PII em claro.
- Correlation/idempotency id por requisicao para rastreabilidade ponta a ponta.
- Alertas para taxas anormais de erro 401/403/429/5xx.
- Proibido logar bearer token do client e token interno assinado em formato bruto.

## Checklist de PR (Seguranca)
- Frontend chama somente o Workers?
- Workers valida bearer token e assina chamada para backend?
- Backend valida assinatura/origem (chave publica) antes da logica de negocio?
- Validacao de borda com `zod` implementada no backend?
- Existe risco de vazamento de PII em logs/erros?
- Algum secret/chave foi exposto em codigo/config/frontend?
- Integracao externa e TursoDB ficaram restritos ao backend?
- Rate limit/idempotencia/replay protection aplicam-se ao fluxo alterado?
- Upload (quando houver) segue formato, tamanho e validacoes?

## Referencias
- Arquitetura e camadas: `agent-docs/ARCHITECTURE.md`
- Padroes de implementacao: `agent-docs/CODING.md`
- Controles de infra/deploy: `agent-docs/INFRA-DEPLOY.md`
