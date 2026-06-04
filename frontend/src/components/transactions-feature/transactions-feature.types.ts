import type { AccountSummary, TransactionSummary } from '../../services/proxy-api/proxy-api.types';

export interface TransactionsFeatureProps {
  accounts: AccountSummary[];
  transactions: TransactionSummary[];
  isLoading: boolean;
  hasError: boolean;
}

export interface TransactionTableRow {
  id: string;
  dateLabel: string;
  description: string;
  categoryLabel: string;
  valueLabel: string;
  valueType: 'credit' | 'debit' | 'neutral';
  icon: string;
}

export interface TransactionCardSummary {
  title: string;
  subtitle: string;
  amountLabel: string;
}
