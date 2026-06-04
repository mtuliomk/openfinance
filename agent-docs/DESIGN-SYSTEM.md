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


## referencia de layout
````
<!DOCTYPE html><html class="light" lang="en"><head>
<meta charset="utf-8">
<meta content="width=device-width, initial-scale=1.0" name="viewport">
<title>Transactions</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;600;700&amp;family=JetBrains+Mono:wght@400;500&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                            "secondary-fixed-dim": "#adc6ff",
                            "primary": "#000000",
                            "inverse-surface": "#213145",
                            "on-secondary-fixed": "#001a42",
                            "surface-tint": "#565e74",
                            "secondary-container": "#2170e4",
                            "on-error": "#ffffff",
                            "on-tertiary": "#ffffff",
                            "inverse-primary": "#bec6e0",
                            "surface-container-lowest": "#ffffff",
                            "on-primary-fixed-variant": "#3f465c",
                            "tertiary-fixed-dim": "#4edea3",
                            "secondary-fixed": "#d8e2ff",
                            "surface-container-high": "#dce9ff",
                            "surface-container-low": "#eff4ff",
                            "on-tertiary-fixed": "#002113",
                            "outline-variant": "#c6c6cd",
                            "inverse-on-surface": "#eaf1ff",
                            "surface-dim": "#cbdbf5",
                            "on-tertiary-container": "#009668",
                            "surface-variant": "#d3e4fe",
                            "on-tertiary-fixed-variant": "#005236",
                            "error-container": "#ffdad6",
                            "primary-fixed-dim": "#bec6e0",
                            "on-primary": "#ffffff",
                            "tertiary-fixed": "#6ffbbe",
                            "background": "#f8f9ff",
                            "primary-fixed": "#dae2fd",
                            "tertiary-container": "#002113",
                            "on-error-container": "#93000a",
                            "tertiary": "#000000",
                            "on-surface-variant": "#45464d",
                            "error": "#ba1a1a",
                            "outline": "#76777d",
                            "surface-container-highest": "#d3e4fe",
                            "on-surface": "#0b1c30",
                            "on-secondary-container": "#fefcff",
                            "on-secondary": "#ffffff",
                            "on-primary-container": "#7c839b",
                            "surface": "#f8f9ff",
                            "on-primary-fixed": "#131b2e",
                            "surface-container": "#e5eeff",
                            "on-secondary-fixed-variant": "#004395",
                            "secondary": "#0058be",
                            "surface-bright": "#f8f9ff",
                            "primary-container": "#131b2e",
                            "on-background": "#0b1c30"
                    },
                    "borderRadius": {
                            "DEFAULT": "0.125rem",
                            "lg": "0.25rem",
                            "xl": "0.5rem",
                            "full": "0.75rem"
                    },
                    "spacing": {
                            "sm": "8px",
                            "xs": "4px",
                            "base": "4px",
                            "margin-desktop": "48px",
                            "gutter": "16px",
                            "max-width": "1280px",
                            "xl": "32px",
                            "md": "16px",
                            "lg": "24px",
                            "margin-mobile": "16px"
                    },
                    "fontFamily": {
                            "body-lg": ["Hanken Grotesk"],
                            "data-tabular": ["JetBrains Mono"],
                            "body-md": ["Hanken Grotesk"],
                            "headline-lg": ["Hanken Grotesk"],
                            "label-md": ["JetBrains Mono"],
                            "headline-lg-mobile": ["Hanken Grotesk"],
                            "headline-md": ["Hanken Grotesk"]
                    },
                    "fontSize": {
                            "body-lg": ["16px", {"lineHeight": "24px", "fontWeight": "400"}],
                            "data-tabular": ["14px", {"lineHeight": "20px", "fontWeight": "400"}],
                            "body-md": ["14px", {"lineHeight": "20px", "fontWeight": "400"}],
                            "headline-lg": ["32px", {"lineHeight": "40px", "letterSpacing": "-0.02em", "fontWeight": "700"}],
                            "label-md": ["12px", {"lineHeight": "16px", "letterSpacing": "0.05em", "fontWeight": "500"}],
                            "headline-lg-mobile": ["24px", {"lineHeight": "32px", "fontWeight": "700"}],
                            "headline-md": ["20px", {"lineHeight": "28px", "fontWeight": "600"}]
                    }
                }
            }
        }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
    </style>
</head>
<body class="bg-background text-on-surface font-body-md antialiased h-screen overflow-hidden flex">
<!-- Navigation Drawer (Desktop) -->
<aside class="hidden lg:flex flex-col w-72 bg-surface border-r border-outline-variant h-full p-lg shrink-0 z-10">
<!-- Brand/Profile Area -->
<div class="mb-xl flex items-center gap-sm">
<div class="w-12 h-12 rounded-full bg-surface-container-high overflow-hidden flex items-center justify-center border border-outline-variant shrink-0">
<span class="material-symbols-outlined text-primary" data-icon="person">person</span>
</div>
<div>
<h2 class="font-headline-md text-headline-md font-bold text-primary">Alex Sterling</h2>
<p class="font-body-md text-body-md text-on-surface-variant">Premium Account</p>
<span class="inline-flex items-center gap-xs text-[10px] uppercase tracking-wider font-bold text-secondary bg-secondary-fixed px-2 py-1 rounded-full mt-1">
<span class="material-symbols-outlined text-[12px]" data-icon="verified" style="font-variation-settings: 'FILL' 1;">verified</span> Verified
                </span>
</div>
</div>
<!-- Navigation Links -->
<nav class="flex-1 space-y-2">
<a class="flex items-center gap-md px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container-low hover:text-primary transition-colors font-body-md text-body-md group" href="#">
<span class="material-symbols-outlined text-outline group-hover:text-primary transition-colors" data-icon="dashboard">dashboard</span>
                Dashboard
            </a>
<!-- Active State -->
<a class="flex items-center gap-md px-4 py-3 rounded-lg bg-secondary-container text-on-secondary-container font-semibold font-body-md text-body-md shadow-sm transition-all duration-200 ease-in-out" href="#">
<span class="material-symbols-outlined text-on-secondary-container" data-icon="receipt_long">receipt_long</span>
                Transactions
            </a>
<div class="space-y-1">
    <button class="w-full flex items-center justify-between px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container-low hover:text-primary transition-colors font-body-md text-body-md group">
        <div class="flex items-center gap-md">
            <span class="material-symbols-outlined text-outline group-hover:text-primary transition-colors" data-icon="account_balance">account_balance</span>
            <span class="">Accounts</span>
        </div>
        <span class="material-symbols-outlined text-outline group-hover:text-primary transition-colors text-[18px]" data-icon="expand_more">expand_more</span>
    </button>
    <div class="pl-12 space-y-1">
        <a href="#" class="block py-2 text-body-md text-on-surface-variant hover:text-primary transition-colors">Checking Account</a>
        <a href="#" class="block py-2 text-body-md text-on-surface-variant hover:text-primary transition-colors">Savings Account</a>
        <a href="#" class="block py-2 text-body-md text-on-surface-variant hover:text-primary transition-colors">Investment Portfolio</a>
    </div>
</div>
<a class="flex items-center gap-md px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container-low hover:text-primary transition-colors font-body-md text-body-md group" href="#">
<span class="material-symbols-outlined text-outline group-hover:text-primary transition-colors" data-icon="pie_chart">pie_chart</span>
                Budgets
            </a>
<a class="flex items-center gap-md px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container-low hover:text-primary transition-colors font-body-md text-body-md group mt-auto" href="#">
<span class="material-symbols-outlined text-outline group-hover:text-primary transition-colors" data-icon="settings">settings</span>
                Settings
            </a>
</nav>
</aside>
<!-- Main Content Area -->
<main class="flex-1 flex flex-col h-full overflow-hidden bg-background relative">
<!-- Top App Bar -->
<header class="sticky top-0 z-40 w-full flex items-center justify-between px-margin-mobile md:px-margin-desktop h-16 bg-surface/80 backdrop-blur-md border-b border-outline-variant shrink-0">
<div class="flex items-center gap-md">
<button class="lg:hidden p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors">
<span class="material-symbols-outlined" data-icon="menu">menu</span>
</button>
<div class="flex items-center gap-sm text-primary">
<span class="material-symbols-outlined hidden md:block" data-icon="account_balance_wallet">account_balance_wallet</span>
<h1 class="font-headline-md text-headline-md md:font-headline-lg md:text-headline-lg font-bold text-primary">Transactions</h1>
</div>
</div>
<div class="flex items-center gap-sm">
<button aria-label="Search" class="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors hover:text-primary active:scale-95 transition-transform">
<span class="material-symbols-outlined" data-icon="search">search</span>
</button>
<div class="w-8 h-8 rounded-full bg-surface-container-high border border-outline-variant overflow-hidden lg:hidden flex items-center justify-center">
<span class="material-symbols-outlined text-sm text-primary" data-icon="person">person</span>
</div>
</div>
</header>
<!-- Scrollable Content -->
<div class="flex-1 overflow-y-auto p-margin-mobile md:p-margin-desktop space-y-xl">
<!-- Summary Card -->
<section class="max-w-max-width mx-auto w-full"><div class="flex flex-col gap-md">
    <div class="flex items-center justify-between">
        <h2 class="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Select Account</h2>
        <div class="flex gap-2">
            <button class="p-1 rounded-full border border-outline-variant hover:bg-surface-container-low text-outline hover:text-primary transition-colors">
                <span class="material-symbols-outlined text-[20px]" data-icon="chevron_left">chevron_left</span>
            </button>
            <button class="p-1 rounded-full border border-outline-variant hover:bg-surface-container-low text-outline hover:text-primary transition-colors">
                <span class="material-symbols-outlined text-[20px]" data-icon="chevron_right">chevron_right</span>
            </button>
        </div>
    </div>
    <div class="flex gap-md overflow-x-auto pb-2 scrollbar-hide">
        <!-- Active Account Card -->
        <div class="min-w-[320px] bg-surface border-2 border-secondary rounded-xl p-lg flex flex-col justify-between shadow-sm shrink-0">
            <div class="flex justify-between items-start mb-md">
                <div class="w-10 h-10 rounded-lg bg-secondary-fixed flex items-center justify-center border border-outline-variant">
                    <span class="material-symbols-outlined text-on-secondary-fixed" data-icon="credit_card">credit_card</span>
                </div>
                <span class="bg-secondary-container text-on-secondary-container text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Active</span>
            </div>
            <div>
                <p class="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-1">Visa Platinum</p>
                <h3 class="font-headline-md text-headline-md text-primary font-semibold mb-4">•••• 4092</h3>
                <div class="flex items-baseline gap-xs">
                    <span class="font-body-md text-body-md text-on-surface-variant">Balance: R$</span>
                    <span class="font-headline-md text-headline-md text-primary font-bold">4.250,00</span>
                </div>
            </div>
        </div>
        <!-- Secondary Account Card -->
        <div class="min-w-[320px] bg-surface border border-outline-variant rounded-xl p-lg flex flex-col justify-between hover:border-secondary/50 transition-colors cursor-pointer shrink-0">
            <div class="flex justify-between items-start mb-md">
                <div class="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center border border-outline-variant">
                    <span class="material-symbols-outlined text-primary" data-icon="credit_card">credit_card</span>
                </div>
            </div>
            <div>
                <p class="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-1">Mastercard Gold</p>
                <h3 class="font-headline-md text-headline-md text-primary font-semibold mb-4">•••• 1234</h3>
                <div class="flex items-baseline gap-xs">
                    <span class="font-body-md text-body-md text-on-surface-variant">Balance: R$</span>
                    <span class="font-headline-md text-headline-md text-primary font-bold">1.890,20</span>
                </div>
            </div>
        </div>
    </div>
</div></section>
<!-- Data Table Area -->
<section class="max-w-max-width mx-auto w-full">
<div class="flex items-center justify-between mb-md">
<h2 class="font-headline-md text-headline-md text-primary font-semibold">Recent Activity</h2>
<button class="flex items-center gap-xs font-label-md text-label-md text-secondary hover:text-secondary-container transition-colors uppercase tracking-wider font-semibold">
                        Filter <span class="material-symbols-outlined text-[16px]" data-icon="filter_list">filter_list</span>
</button>
</div>
<div class="bg-surface border border-outline-variant rounded-xl overflow-hidden">
<div class="overflow-x-auto">
<table class="w-full text-left border-collapse min-w-[800px]">
<thead>
<tr class="border-b border-outline-variant bg-surface-container-lowest">
<th class="py-4 px-6 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-medium w-32">Date</th>
<th class="py-4 px-6 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-medium">Description</th>
<th class="py-4 px-6 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-medium w-48">Category</th>
<th class="py-4 px-6 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-medium w-40 text-right">Value</th>
<th class="py-4 px-6 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-medium w-24 text-center">Action</th>
</tr>
</thead>
<tbody class="divide-y divide-outline-variant bg-surface">
<!-- Row 1 -->
<tr class="hover:bg-surface-container-lowest transition-colors group cursor-pointer h-[56px]">
<td class="py-3 px-6 font-data-tabular text-data-tabular text-on-surface-variant whitespace-nowrap">Oct 24, 2023</td>
<td class="py-3 px-6">
<div class="flex items-center gap-sm">
<div class="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center shrink-0 text-primary">
<span class="material-symbols-outlined text-[18px]" data-icon="shopping_bag">shopping_bag</span>
</div>
<span class="font-body-md text-body-md text-on-surface font-medium group-hover:text-secondary transition-colors">Apple Store Morumbi</span>
</div>
</td>
<td class="py-3 px-6">
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface-container text-on-surface-variant border border-outline-variant/30">
                                            Electronics
                                        </span>
</td>
<td class="py-3 px-6 font-data-tabular text-data-tabular text-on-surface text-right whitespace-nowrap font-medium">
                                        - R$ 1.250,00
                                    </td>
<td class="py-3 px-6 text-center">
<button class="p-1.5 text-outline hover:text-primary hover:bg-surface-container-high rounded-md transition-colors" title="Details">
<span class="material-symbols-outlined text-[20px]" data-icon="chevron_right">chevron_right</span>
</button>
</td>
</tr>
<!-- Row 2 -->
<tr class="hover:bg-surface-container-lowest transition-colors group cursor-pointer h-[56px]">
<td class="py-3 px-6 font-data-tabular text-data-tabular text-on-surface-variant whitespace-nowrap">Oct 22, 2023</td>
<td class="py-3 px-6">
<div class="flex items-center gap-sm">
<div class="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center shrink-0 text-primary">
<span class="material-symbols-outlined text-[18px]" data-icon="restaurant">restaurant</span>
</div>
<span class="font-body-md text-body-md text-on-surface font-medium group-hover:text-secondary transition-colors">Fogo de Chão</span>
</div>
</td>
<td class="py-3 px-6">
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface-container text-on-surface-variant border border-outline-variant/30">
                                            Dining
                                        </span>
</td>
<td class="py-3 px-6 font-data-tabular text-data-tabular text-on-surface text-right whitespace-nowrap font-medium">
                                        - R$ 345,50
                                    </td>
<td class="py-3 px-6 text-center">
<button class="p-1.5 text-outline hover:text-primary hover:bg-surface-container-high rounded-md transition-colors" title="Details">
<span class="material-symbols-outlined text-[20px]" data-icon="chevron_right">chevron_right</span>
</button>
</td>
</tr>
<!-- Row 3 (Income) -->
<tr class="hover:bg-surface-container-lowest transition-colors group cursor-pointer h-[56px]">
<td class="py-3 px-6 font-data-tabular text-data-tabular text-on-surface-variant whitespace-nowrap">Oct 20, 2023</td>
<td class="py-3 px-6">
<div class="flex items-center gap-sm">
<div class="w-8 h-8 rounded-full bg-tertiary-fixed flex items-center justify-center shrink-0 text-on-tertiary-fixed">
<span class="material-symbols-outlined text-[18px]" data-icon="arrow_downward">arrow_downward</span>
</div>
<span class="font-body-md text-body-md text-on-surface font-medium group-hover:text-secondary transition-colors">Pix Received - João S.</span>
</div>
</td>
<td class="py-3 px-6">
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface-container text-on-surface-variant border border-outline-variant/30">
                                            Transfer
                                        </span>
</td>
<td class="py-3 px-6 font-data-tabular text-data-tabular text-on-tertiary-container text-right whitespace-nowrap font-medium">
                                        + R$ 500,00
                                    </td>
<td class="py-3 px-6 text-center">
<button class="p-1.5 text-outline hover:text-primary hover:bg-surface-container-high rounded-md transition-colors" title="Details">
<span class="material-symbols-outlined text-[20px]" data-icon="chevron_right">chevron_right</span>
</button>
</td>
</tr>
<!-- Row 4 -->
<tr class="hover:bg-surface-container-lowest transition-colors group cursor-pointer h-[56px]">
<td class="py-3 px-6 font-data-tabular text-data-tabular text-on-surface-variant whitespace-nowrap">Oct 18, 2023</td>
<td class="py-3 px-6">
<div class="flex items-center gap-sm">
<div class="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center shrink-0 text-primary">
<span class="material-symbols-outlined text-[18px]" data-icon="directions_car">directions_car</span>
</div>
<span class="font-body-md text-body-md text-on-surface font-medium group-hover:text-secondary transition-colors">Uber Trip</span>
</div>
</td>
<td class="py-3 px-6">
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface-container text-on-surface-variant border border-outline-variant/30">
                                            Transport
                                        </span>
</td>
<td class="py-3 px-6 font-data-tabular text-data-tabular text-on-surface text-right whitespace-nowrap font-medium">
                                        - R$ 42,90
                                    </td>
<td class="py-3 px-6 text-center">
<button class="p-1.5 text-outline hover:text-primary hover:bg-surface-container-high rounded-md transition-colors" title="Details">
<span class="material-symbols-outlined text-[20px]" data-icon="chevron_right">chevron_right</span>
</button>
</td>
</tr>
<!-- Row 5 -->
<tr class="hover:bg-surface-container-lowest transition-colors group cursor-pointer h-[56px]">
<td class="py-3 px-6 font-data-tabular text-data-tabular text-on-surface-variant whitespace-nowrap">Oct 15, 2023</td>
<td class="py-3 px-6">
<div class="flex items-center gap-sm">
<div class="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center shrink-0 text-primary">
<span class="material-symbols-outlined text-[18px]" data-icon="subscriptions">subscriptions</span>
</div>
<span class="font-body-md text-body-md text-on-surface font-medium group-hover:text-secondary transition-colors">Netflix Subscription</span>
</div>
</td>
<td class="py-3 px-6">
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface-container text-on-surface-variant border border-outline-variant/30">
                                            Services
                                        </span>
</td>
<td class="py-3 px-6 font-data-tabular text-data-tabular text-on-surface text-right whitespace-nowrap font-medium">
                                        - R$ 55,90
                                    </td>
<td class="py-3 px-6 text-center">
<button class="p-1.5 text-outline hover:text-primary hover:bg-surface-container-high rounded-md transition-colors" title="Details">
<span class="material-symbols-outlined text-[20px]" data-icon="chevron_right">chevron_right</span>
</button>
</td>
</tr>
</tbody>
</table>
</div>
<!-- Pagination Footer -->
<div class="bg-surface-container-lowest border-t border-outline-variant px-6 py-3 flex items-center justify-between">
<span class="font-label-md text-label-md text-on-surface-variant">Showing 1 to 5 of 24 entries</span>
<div class="flex items-center gap-2">
<button class="p-1 rounded text-outline hover:bg-surface-container hover:text-primary transition-colors disabled:opacity-50" disabled="">
<span class="material-symbols-outlined text-[20px]" data-icon="chevron_left">chevron_left</span>
</button>
<span class="font-label-md text-label-md text-primary font-medium px-2">Page 1 of 5</span>
<button class="p-1 rounded text-outline hover:bg-surface-container hover:text-primary transition-colors">
<span class="material-symbols-outlined text-[20px]" data-icon="chevron_right">chevron_right</span>
</button>
</div>
</div>
</div>
</section>
<!-- Padding at bottom for scroll clearance -->
<div class="h-12 w-full lg:hidden"></div>
</div>
</main>
<!-- Bottom Nav Bar (Mobile Only) -->
<nav class="fixed bottom-0 left-0 w-full z-50 lg:hidden flex justify-around items-center h-16 px-4 bg-surface border-t border-outline-variant shadow-lg pb-safe">
<a class="flex flex-col items-center justify-center text-on-surface-variant w-16 h-full transition-colors" href="#">
<span class="material-symbols-outlined" data-icon="home">home</span>
<span class="font-label-md text-[10px] mt-1">Home</span>
</a>
<a class="flex flex-col items-center justify-center text-secondary font-bold w-16 h-full transition-colors" href="#">
<span class="material-symbols-outlined" data-icon="insights" style="font-variation-settings: 'FILL' 1;">insights</span>
<span class="font-label-md text-[10px] mt-1">Activity</span>
</a>
<a class="flex flex-col items-center justify-center text-on-surface-variant w-16 h-full transition-colors" href="#">
<span class="material-symbols-outlined" data-icon="credit_card">credit_card</span>
<span class="font-label-md text-[10px] mt-1">Cards</span>
</a>
<a class="flex flex-col items-center justify-center text-on-surface-variant w-16 h-full transition-colors" href="#">
<span class="material-symbols-outlined" data-icon="menu">menu</span>
<span class="font-label-md text-[10px] mt-1">Menu</span>
</a>
</nav>


</body></html>

```