export interface InvestmentsDashboardData {
  title: string;
  count: string;
  description: string;
}

export interface InvestmentsDashboardState {
  data: InvestmentsDashboardData;
  isLoading: boolean;
  hasError: boolean;
}

export interface InvestmentsDashboardProps {
  state: InvestmentsDashboardState;
}
