export interface ConnectedAccountsDashboardData {
  title: string;
  count: number;
  description: string;
}

export interface ConnectedAccountsDashboardState {
  data: ConnectedAccountsDashboardData;
  isLoading: boolean;
  hasError: boolean;
}

export interface ConnectedAccountsDashboardProps {
  state: ConnectedAccountsDashboardState;
}
