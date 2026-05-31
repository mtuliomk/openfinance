export interface ProxyRequestConfig {
  path: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
}

export interface OpenFinanceReloadResult {
  statusCode?: number;
  body?: unknown;
}

export interface AccountSummary {
  id: string;
  name?: string | null;
  balance?: number | null;
  subtype?: string | null;
  type?: string | null;
  number?: string | null;
  bankData?: {
    transferNumber?: string | null;
  } | null;
}

export interface InvestmentSummary {
  id: string;
  balance: number;
  purchaseDate: string | null;
}

export interface TransactionSummary {
  id: string;
  accountId: string;
  description: string;
  amount: number;
  date: string;
  category: string | null;
  type: string | null;
  operationType: string | null;
  paymentData: {
    payer: {
      documentNumber: {
        value: string | null;
      } | null;
      name: string | null;
      routingNumber: string | null;
      branchNumber: string | null;
      accountNumber: string | null;
    } | null;
    receiver: {
      documentNumber: {
        value: string | null;
      } | null;
      name: string | null;
      routingNumber: string | null;
      branchNumber: string | null;
      accountNumber: string | null;
    } | null;
  } | null;
}
