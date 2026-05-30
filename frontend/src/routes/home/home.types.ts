export const HOME_FEATURES = ['home', 'contas', 'investimentos', 'cartoes', 'outros'] as const;

export type HomeFeatureKey = (typeof HOME_FEATURES)[number];

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
