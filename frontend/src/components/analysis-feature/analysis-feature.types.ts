import type { AccountSummary, TransactionSummary } from '../../services/proxy-api/proxy-api.types';

export const CREDIT_CARD_SUBTYPE = 'CREDIT_CARD';
export const DEFAULT_RANGE_DAYS = 30;
export const TOP_MERCHANTS_LIMIT = 4;
export const CATEGORY_MONTHS_RANGE = 4;
export const TOP_CATEGORIES_LIMIT = 10;

export interface AnalysisFeatureProps {
  accounts: AccountSummary[];
  transactions: TransactionSummary[];
  transactionsLoading: boolean;
  transactionsError: boolean;
}

export interface CategorySpendItem {
  category: string;
  total: number;
}

export interface MerchantSpendItem {
  merchant: string;
  total: number;
}

export interface MerchantInstallmentsItem {
  merchant: string;
  total: number;
  pending: number;
}

export interface AnalysisDashboardData {
  categorySpend: CategorySpendItem[];
  topMerchants: MerchantSpendItem[];
  installmentsByMerchant: MerchantInstallmentsItem[];
}

export interface CategoryMonthlySpendItem {
  category: string;
  monthlyCosts: number[];
}

export interface CategoryMonthlySpendData {
  monthLabels: string[];
  items: CategoryMonthlySpendItem[];
}
