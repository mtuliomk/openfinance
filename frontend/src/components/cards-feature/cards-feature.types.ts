import type { AccountSummary, TransactionSummary } from '../../services/proxy-api/proxy-api.types';

export const CREDIT_CARD_SUBTYPE = 'CREDIT_CARD';

export interface CardsFeatureCardData {
  id: string;
  holder: string;
  number: string;
  brand: string;
  balanceLabel: string;
}

export interface CardsFeatureState {
  accounts: AccountSummary[];
  isLoading: boolean;
  hasError: boolean;
}

export interface CardsFeatureProps {
  state: CardsFeatureState;
  transactions: TransactionSummary[];
  transactionsLoading: boolean;
  transactionsError: boolean;
  onCardClick?: (cardId: string) => void;
}
