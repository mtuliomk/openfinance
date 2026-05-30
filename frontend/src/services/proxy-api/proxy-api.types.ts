export interface ProxyRequestConfig {
  path: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
}

export interface AccountSummary {
  id: string;
  name?: string | null;
  balance?: number | null;
  subtype?: string | null;
}

export interface InvestmentSummary {
  id: string;
  balance: number;
  purchaseDate: string | null;
}
