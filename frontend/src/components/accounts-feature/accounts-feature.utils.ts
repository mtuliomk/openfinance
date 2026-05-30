import type { AccountSummary, TransactionSummary } from '../../services/proxy-api/proxy-api.types';
import { CHECKING_ACCOUNT_SUBTYPE, type AccountsFeatureCardData } from './accounts-feature.types';

const UNKNOWN_LABEL = '-';

export function toAccountsFeatureCardData(accounts: AccountSummary[]): AccountsFeatureCardData[] {
  return accounts
    .filter((account) => account.subtype === CHECKING_ACCOUNT_SUBTYPE)
    .map((account) => ({
      id: account.id,
      type: account.type ?? UNKNOWN_LABEL,
      number: account.number ?? UNKNOWN_LABEL,
      balanceLabel: formatCurrency(account.balance),
      bank: parseBankFromTransferNumber(account.bankData?.transferNumber ?? null),
    }));
}

export function parseBankFromTransferNumber(transferNumber: string | null): string {
  if (!transferNumber) {
    return UNKNOWN_LABEL;
  }

  const [bank] = transferNumber.split('/');
  const normalized = bank.trim();

  return normalized.length > 0 ? normalized : UNKNOWN_LABEL;
}

export function getTransactionsByAccountId(transactions: TransactionSummary[], accountId: string): TransactionSummary[] {
  return transactions.filter((transaction) => transaction.accountId === accountId);
}

export function formatTransactionAmount(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function paginateTransactions<T>(items: T[], page: number, pageSize: number): T[] {
  const safePage = Math.max(1, page);
  const safePageSize = Math.max(1, pageSize);
  const start = (safePage - 1) * safePageSize;
  return items.slice(start, start + safePageSize);
}

function formatCurrency(value: number | null | undefined): string {
  if (typeof value !== 'number') {
    return UNKNOWN_LABEL;
  }

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}
