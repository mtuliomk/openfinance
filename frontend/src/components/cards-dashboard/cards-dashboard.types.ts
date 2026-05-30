export interface CardsDashboardData {
  title: string;
  count: string;
  description: string;
}

export interface CardsDashboardState {
  data: CardsDashboardData;
  isLoading: boolean;
  hasError: boolean;
}

export interface CardsDashboardProps {
  state: CardsDashboardState;
}
