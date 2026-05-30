import type { HomeFeatureKey, HomeFeatureMap } from './home.types';

export function getHomeFeatureLabel(feature: HomeFeatureKey): string {
  if (feature === 'cartoes') {
    return 'cartões';
  }

  return feature;
}

export function getHomeFeatureContent(): HomeFeatureMap {
  return {
    home: {
      title: 'Home',
      subtitle: 'Visão geral',
      content: 'Resumo inicial da sua jornada financeira.',
    },
    contas: {
      title: 'Contas',
      subtitle: 'Saldos e movimentações',
      content: 'Acompanhe contas conectadas e histórico recente.',
    },
    investimentos: {
      title: 'Investimentos',
      subtitle: 'Posição consolidada',
      content: 'Consulte evolução e distribuição dos seus ativos.',
    },
    cartoes: {
      title: 'Cartões',
      subtitle: 'Faturas e limites',
      content: 'Veja gastos, fechamento e limite disponível.',
    },
    outros: {
      title: 'Outros',
      subtitle: 'Serviços adicionais',
      content: 'Área para funcionalidades complementares.',
    },
  };
}

export function getCopyrightText(): string {
  return `© ${new Date().getFullYear()} OpenFinance`;
}
