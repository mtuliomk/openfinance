export const HOME_FEATURES = ['home', 'transactions', 'contas', 'investimentos', 'cartoes', 'analise', 'atualizar', 'outros'] as const;

export type HomeFeatureKey = (typeof HOME_FEATURES)[number];

export interface HomeProps {
  activeFeature?: HomeFeatureKey;
}

export interface HomeFeatureContent {
  title: string;
  subtitle: string;
  content: string;
}

export interface ConnectedAccountsDashboardData {
  title: string;
  count: number;
  description: string;
}

export type HomeFeatureMap = Record<HomeFeatureKey, HomeFeatureContent>;
