# CODING.md

## Objetivo
Definir padrões de implementação para entregas consistentes, pequenas e testáveis no monorepo.

## Stack e Padrão Atual
- Monorepo com Yarn.
- Frontend: SPA em React + TypeScript.
- Backend: Node.js + TypeScript.
- Persistencia backend: TursoDB com Drizzle ORM + Drizzle Kit.
- ESLint como gate de qualidade.
- Validação de entrada com `zod` na borda do backend.

## Estrutura de Referência
```text
frontend/
  src/
    routes/
    components/
    services/
    hooks/
    state/
    shared/
    assets/

backend/
  src/
    app/
    modules/
    shared/
    infra/
```

## Backend Runtime Duplo (Obrigatorio)
- O backend deve suportar dois runtimes de entrada:
  - AWS Lambda (producao).
  - Server Node.js local (desenvolvimento).
- O codigo de regra de negocio deve ser unico e compartilhado entre os dois runtimes.
- Os entrypoints de transporte devem ficar em `backend/src/app/` e apenas adaptar protocolo (HTTP/Lambda) para os casos de uso.
- Convencao recomendada:
  - `backend/src/app/lambda/*` para handlers Lambda.
  - `backend/src/app/server/*` para servidor local e rotas locais.
- Proibido duplicar regra de negocio entre `lambda` e `server`.
- Validacao de entrada com `zod` permanece obrigatoria na borda de cada entrada.
- Dependencias de runtime (AWS, HTTP server, framework web) nao podem contaminar o dominio.

## Fronteira Client x Backend (Obrigatoria)
- Proibido implementar regra de negocio no client (`frontend/src/*`).
- Proibido consumo direto de API externa no frontend.
- O frontend deve consumir apenas contratos do backend.
- Toda validacao de entrada deve ocorrer na borda do backend com `zod`.
- Segredos, tokens e credenciais devem existir apenas no backend.

## Convencao de Modulos TypeScript (Obrigatoria)
Todo novo modulo TypeScript/TSX deve seguir separacao por arquivos:
- `nome-modulo.ts`
- `nome-modulo.types.ts` (obrigatorio: concentra types, interfaces e constants/constraints do modulo)
- `nome-modulo.utils.ts`
- `__test__/`

Aplicacao obrigatoria:
- `frontend/src/*`
- `backend/src/*`

### Regra de Unificacao de Tipos (Obrigatoria)
- Os arquivos `*.interfaces.ts` e `*.constants.ts` deixam de existir como padrao.
- Tipos, interfaces, enums, literais, constantes e constraints do modulo devem ser definidos em `*.types.ts`.
- Objetivo: reduzir fragmentacao e tornar mais previsivel a localizacao de contratos do modulo.

### O que deve ficar em `*.types.ts`
- `type` e `interface` de entrada, saida e contrato interno.
- `enum` e unioes literais.
- `const` de dominio e constraints (ex.: limites, listas permitidas, nomes de eventos, codigos internos).
- Tipos derivados com `as const`, `keyof`, `typeof`, quando aplicavel.

### O que nao deve ficar em `*.types.ts`
- Funcoes com logica de negocio.
- Acesso a I/O (HTTP, DB, filesystem, SDK externo).
- Transformacoes utilitarias complexas (devem ir para `*.utils.ts`).
- Validacao de borda com `zod` (permanece no ponto de entrada/borda).

### Exemplo de Estrutura
```text
modulo-x/
  modulo-x.ts
  modulo-x.types.ts
  modulo-x.utils.ts
  __test__/
```

### Exemplo de Conteudo de `modulo-x.types.ts`
```ts
export const ACCOUNT_STATUS = ['active', 'inactive'] as const;
export type AccountStatus = (typeof ACCOUNT_STATUS)[number];

export const MAX_PAGE_SIZE = 100;

export interface ListAccountsInput {
  page: number;
  pageSize: number;
}

export interface ListAccountsOutput {
  items: Array<{ id: string; status: AccountStatus }>;
  nextCursor?: string;
}
```

### Regra de Migracao para Codigo Existente
- Ao tocar modulo legado com `*.interfaces.ts` ou `*.constants.ts`, migrar para `*.types.ts` no mesmo PR.
- Se a migracao completa aumentar muito o escopo, registrar no PR/commit o recorte aplicado e o debito tecnico remanescente.

## Regras Obrigatorias
- Manter codigo simples, legivel e coeso.
- Entregar mudancas pequenas, incrementais e testaveis.
- Evitar mudancas amplas fora do escopo.
- Remover imports e codigo morto ao tocar arquivos.
- Nao introduzir dependencias sem necessidade clara.
- Evitar `any`; quando inevitavel, registrar justificativa tecnica no PR/commit.
- Em backend, manter separacao entre:
  - Borda (`app/lambda` e `app/server`).
  - Aplicacao/dominio (`modules/*`).
  - Adaptadores de infraestrutura (`infra/*`).

## Banco de Dados e Migrations (Obrigatorio)
- O acesso ao TursoDB deve ocorrer apenas no backend.
- Drizzle deve ser usado como padrao para schema, query builder/ORM e migrations.
- Convencoes obrigatorias:
  - Schema Drizzle em `backend/src/infra/database/turso/schema/*`.
  - Repositorios Drizzle em `backend/src/infra/database/turso/repositories/*`.
  - Migrations versionadas em `backend/migrations/*`.
  - Configuracao em `backend/drizzle.config.ts`.
- `modules/*` nao pode depender diretamente de Drizzle; deve depender de contratos (interfaces/tipos) do modulo.
- Toda mudanca de schema deve gerar migration no mesmo PR.
- Evitar SQL inline em camada de dominio; queries e mapeamentos de persistencia pertencem a `infra`.
- Em producao, migrations devem rodar por comando explicito de deploy/pipeline.
- Em desenvolvimento local, auto-migrate so com flag de ambiente explicita.

## Alinhamento Migration x Types (Obrigatorio)
- Fluxo minimo para mudanca de schema:
  1. Atualizar schema Drizzle.
  2. Gerar migration.
  3. Aplicar migration local.
  4. Ajustar repositorios/servicos afetados.
  5. Validar typecheck e testes.
- Nao usar `any` para contornar incompatibilidades entre schema e codigo.

## Mocks
- Quando necessario, criar mocks JSON em:
  - `frontend/src/shared/mock` para cenarios de UI local.
  - `backend/src/shared/mock` para cenarios de contrato e integracao simulada.
- O acesso a mocks com regra, validacao ou transformacao deve ocorrer no backend.
- E proibido consumo direto de mock no client quando houver regra de negocio envolvida.

## Mascaramento de Dados (PII)
- O mascaramento deve ser aplicado no backend (camada de servico/use case), nunca no client.
- Formatos obrigatorios:
  - CPF: `222.***.**8-84`
  - E-mail: `a****@gmail.com`
  - Telefone: `(**)**74-**63`

## UI e Experiencia (Frontend SPA)
- Priorizar mobile-first em layout e componentes.
- Componentes devem ser simples, isolados e reutilizaveis.
- Acessibilidade basica obrigatoria: labels, foco visivel e contraste minimo.
- Evitar renderizacoes desnecessarias e assets pesados para performance mobile.

## Qualidade e Validacao
Executar antes de concluir alteracoes:
1. `yarn lint`
2. `yarn typecheck`
3. `yarn test`
4. `yarn build`

Regra:
- Se algum comando nao existir ou falhar, registrar no resumo final e nao concluir tarefa como pronta.

## Convencao de Commits
- Conventional Commits (`feat`, `fix`, `refactor`, `test`, `docs`).
- Commits pequenos e atomicos.
- Registrar no PR/commit: tradeoffs, riscos, proximos passos e aderencia ao `agent-docs`.

## Referencias
- Arquitetura: `agent-docs/ARCHITECTURE.md`
- Seguranca: `agent-docs/SECURITY.md`
- Infra e deploy: `agent-docs/INFRA-DEPLOY.md`
