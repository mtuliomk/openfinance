import type { AccountSummary } from '../../services/proxy-api/proxy-api.types';
import type { TransactionSummary } from '../../services/proxy-api/proxy-api.types';

export const CHECKING_ACCOUNT_SUBTYPE = 'CHECKING_ACCOUNT';

export interface AccountsFeatureCardData {
  id: string;
  type: string;
  number: string;
  balanceLabel: string;
  bank: string;
}

export interface AccountsFeatureState {
  accounts: AccountSummary[];
  isLoading: boolean;
  hasError: boolean;
}

export interface AccountsFeatureProps {
  state: AccountsFeatureState;
  transactions: TransactionSummary[];
  transactionsLoading: boolean;
  transactionsError: boolean;
  onAccountClick?: (accountId: string) => void;
}
