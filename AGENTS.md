# AGENTS.md

## Objetivo do Projeto
Construir uma POC de openbank usando apis da pluggy.ai em um monorepo com `frontend` e `backend`.

## Estrutura do Repositório
- Este projeto adota arquitetura de monorepo.
- Aplicações principais:
  - `frontend/`: aplicação cliente (UI).
  - `backend/`: aplicação servidor (API e regras de negócio).

## Princípios Obrigatórios
- AI FIRST: toda feature deve ser pensada para acelerar entrega com apoio de IA (geração de código, revisão, testes e documentação).
- MOBILE FIRST: decisões de UX/UI priorizam primeiro a experiência em telas pequenas.
- Sempre use `yarn` como gerenciador de pacotes principal. Evite `npm`.

## Diretrizes para Agentes de IA
- Entregar mudanças pequenas, incrementais e testáveis.
- Antes de alterar código, montar um plano detalhado do que será feito e solicitar aprovação para continuar.
- Antes de codar, explicitar escopo e critérios de aceite da tarefa.
- Sempre que alterar código, validar com `yarn lint`, `yarn typecheck`, `yarn test` e `yarn build`.
- Registrar decisões relevantes no PR/commit (tradeoffs, riscos e próximos passos).
- Evitar dependências pesadas sem justificativa clara de valor para a jornada mobile.

## Fonte de Verdade Técnica (Obrigatório)
- Os arquivos da pasta `agent-docs/` são a fonte de verdade para implementação.
- Ordem de precedência obrigatória:
  1. `agent-docs/CODING.md`
  2. `agent-docs/ARCHITECTURE.md`
  3. `agent-docs/SECURITY.md`
  4. `agent-docs/INFRA-DEPLOY.md`
- Em caso de conflito, seguir a ordem acima e registrar a decisão no PR/commit.

## Protocolo Obrigatório Antes de Codar
- Ler e citar explicitamente quais seções de `agent-docs/*` serão aplicadas.
- Declarar escopo, critérios de aceite e restrições arquiteturais antes de implementar.
- Propor plano incremental e pedir aprovação antes de alterar código.

## Guardrails de Implementação (Bloqueantes)
- Proibido implementar regra de negócio no client.
- Proibido consumo direto de API externa no frontend.
- Regras de formatação de entrada no client devem seguir `agent-docs/CODING.md` (seção "Fronteira Client x Backend (Obrigatoria)").
- Toda validação de entrada deve ocorrer na borda com `zod`.
- Sem `any` sem justificativa técnica registrada no PR/commit.
- Novos módulos devem seguir convenção de arquivos definida em `agent-docs/CODING.md`.
- A separação por arquivos de módulo (`.ts`, `.types.ts`, `.interfaces.ts`, `.constants.ts`, `.utils.ts`, `__test__`) é obrigatória para agentes e bloqueante de conformidade.
- Essa obrigatoriedade se aplica a todo código TypeScript/TSX do repositório, incluindo `src/app/*` (páginas/layouts), `src/components/*`, `src/server/*` e `src/shared/*`.

## Qualidade e Evidências (Obrigatório em Toda Entrega)
- Executar e registrar os resultados de:
  - `yarn lint`
  - `yarn typecheck`
  - `yarn test`
  - `yarn build`
- Se algum gate falhar, não concluir a tarefa como pronta.
- Registrar no PR/commit: tradeoffs, riscos, próximos passos e aderência ao `agent-docs`.

## Checklist de Conformidade do Agente
- [ ] Li `agent-docs/CODING.md` antes de codar.
- [ ] A mudança segue arquitetura e camadas definidas no `agent-docs`.
- [ ] Não há regra de negócio no client.
- [ ] Não há integração externa direta no frontend.
- [ ] Testes mínimos cobrindo sucesso, validação, falha externa e idempotência (quando aplicável).
- [ ] Gates executados com evidência.

## Qualidade
- Código TypeScript estrito e legível.
- Componentes simples, isolados e reutilizáveis.
- Acessibilidade basica: labels, foco e contraste.
- Performance mobile: evitar renderizações e assets desnecessários.

## Referências de Documentação (agent-docs)
- Arquitetura: `agent-docs/ARCHITECTURE.md`
- Padrões de código: `agent-docs/CODING.md`
- Infra e deploy: `agent-docs/INFRA-DEPLOY.md`
- Segurança: `agent-docs/SECURITY.md`
