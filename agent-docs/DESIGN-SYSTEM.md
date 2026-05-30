# DESIGN-SYSTEM.md

## Objetivo
Padronizar tokens e componentes de UI com foco em consistencia visual, legibilidade, responsividade e experiencia mobile-first no frontend SPA.

## Escopo
- Este documento se aplica ao `frontend/` do monorepo.
- O backend nao define regras visuais; apenas contratos de dados que impactam estados de UI.

## Tipografia
- Fonte padrao do produto: `Sora`.
- Aplicacao global da tipografia deve ocorrer no bootstrap da SPA (entrypoint de estilos globais).
- Fallback: `sans-serif`.

## Escala Tipografica Base (Obrigatoria)
### Navegacao e Estrutura
- Nome do produto: `1rem`
- Itens de navegacao primarios: `0.95rem`
- Itens de navegacao secundarios: `0.9rem`

### Conteudo
- Titulo de pagina (`h1`): `1.25rem`
- Subtitulo: `1rem`
- Titulo de card: `0.9rem`
- Valor numerico em destaque: `1.4rem`

Regra:
- Novos componentes devem seguir essa escala como baseline e justificar desvios no PR.

## Tokens de Design
- Tokens devem ser centralizados em variaveis CSS globais em `frontend/src/shared/styles`.
- Conjunto minimo de tokens:
  - `--background`, `--surface`, `--surface-2`
  - `--primary`, `--primary-strong`
  - `--text`, `--muted`, `--border`, `--focus`, `--danger`, `--success`
- Nao usar cores hardcoded em componentes sem justificativa.

## Estrutura de UI (Frontend SPA)
- Rotas e composicao de tela em `frontend/src/routes`.
- Componentes reutilizaveis em `frontend/src/components`.
- Recursos visuais em `frontend/src/assets` e arquivos publicos em `frontend/public`.
- Estados de UI globais (tema, sessao visual, preferencia de layout) em `frontend/src/state`.

## Componentizacao
- Componentes devem ser pequenos, isolados e orientados por responsabilidade unica.
- Props tipadas obrigatoriamente com TypeScript estrito.
- Evitar componentes com regra de negocio; logica de dominio deve vir pronta do backend.

## Estados de UI
- Estados obrigatorios para telas de dados remotos:
  - carregando
  - vazio
  - erro
  - sucesso
- Mensagens de erro devem ser amigaveis e sem expor detalhes internos do backend.

## Acessibilidade Basica
- `label` explicito para campos de formulario.
- `focus-visible` em elementos interativos.
- Contraste minimo adequado entre texto e fundo.
- Navegacao por teclado preservada em componentes interativos.

## Performance Mobile
- Priorizar layouts fluidos e breakpoints para telas pequenas.
- Evitar assets pesados e renderizacoes desnecessarias.
- Aplicar code splitting por rota quando houver ganho real de carregamento inicial.

## Identidade Visual
- Logo oficial e ativos de marca devem ficar no `frontend/public` ou `frontend/src/assets`.
- Mudancas de branding (logo, tipografia, paleta) devem atualizar este documento e os tokens globais no mesmo PR.

## Evolucao
- Reaproveitar tokens e componentes existentes antes de criar novos.
- Toda nova variante visual deve registrar motivacao, tradeoff e impacto mobile no PR/commit.

## Referencias
- Arquitetura: `agent-docs/ARCHITECTURE.md`
- Padroes de codigo: `agent-docs/CODING.md`
- Seguranca: `agent-docs/SECURITY.md`
