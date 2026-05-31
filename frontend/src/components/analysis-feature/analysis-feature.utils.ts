import type { AccountSummary, TransactionSummary } from '../../services/proxy-api/proxy-api.types';
import {
  CATEGORY_MONTHS_RANGE,
  CREDIT_CARD_SUBTYPE,
  DEFAULT_RANGE_DAYS,
  TOP_CATEGORIES_LIMIT,
  TOP_MERCHANTS_LIMIT,
  type AnalysisDashboardData,
  type CategoryMonthlySpendData,
  type MerchantInstallmentsItem,
} from './analysis-feature.types';

const UNKNOWN_LABEL = 'Sem categoria';
const UNKNOWN_MERCHANT = 'Desconhecido';

export function getDefaultDateRange(today = new Date()): { startDate: string; endDate: string } {
  const end = toDateOnly(today);
  const start = new Date(end);
  start.setDate(start.getDate() - (DEFAULT_RANGE_DAYS - 1));

  return {
    startDate: toInputDate(start),
    endDate: toInputDate(end),
  };
}

export function buildAnalysisDashboardData(params: {
  accounts: AccountSummary[];
  transactions: TransactionSummary[];
  startDate: string;
  endDate: string;
}): AnalysisDashboardData {
  const creditCardTransactions = getCreditCardTransactionsInRange(params);

  return {
    categorySpend: aggregateByCategory(creditCardTransactions),
    topMerchants: aggregateTopMerchants(creditCardTransactions),
    installmentsByMerchant: aggregateInstallmentsByMerchant(creditCardTransactions),
  };
}

export function getCreditCardTransactionsInRange(params: {
  accounts: AccountSummary[];
  transactions: TransactionSummary[];
  startDate: string;
  endDate: string;
}): TransactionSummary[] {
  const creditCardAccountIds = new Set(
    params.accounts.filter((account) => account.subtype === CREDIT_CARD_SUBTYPE).map((account) => account.id),
  );

  return params.transactions.filter((transaction) => {
    if (!creditCardAccountIds.has(transaction.accountId)) {
      return false;
    }

    const transactionDate = toDateOnly(new Date(transaction.date));
    const start = toDateOnly(new Date(params.startDate));
    const end = toDateOnly(new Date(params.endDate));

    return transactionDate >= start && transactionDate <= end;
  });
}

function aggregateByCategory(transactions: TransactionSummary[]): Array<{ category: string; total: number }> {
  const totals = new Map<string, number>();

  transactions.forEach((transaction) => {
    const category = transaction.category?.trim() || UNKNOWN_LABEL;
    totals.set(category, (totals.get(category) ?? 0) + transaction.amount);
  });

  return [...totals.entries()]
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);
}

function aggregateTopMerchants(transactions: TransactionSummary[]): Array<{ merchant: string; total: number }> {
  const totals = new Map<string, number>();

  transactions.forEach((transaction) => {
    if (transaction.amount <= 0) {
      return;
    }

    const merchant = getMerchantName(transaction);
    totals.set(merchant, (totals.get(merchant) ?? 0) + transaction.amount);
  });

  const sortedMerchants = [...totals.entries()]
    .map(([merchant, total]) => ({ merchant, total }))
    .sort((a, b) => b.total - a.total);

  const topMerchants = sortedMerchants.slice(0, TOP_MERCHANTS_LIMIT);
  const unknownMerchant = sortedMerchants.find((item) => item.merchant === UNKNOWN_MERCHANT);
  const hasUnknownInTop = topMerchants.some((item) => item.merchant === UNKNOWN_MERCHANT);

  if (unknownMerchant && !hasUnknownInTop) {
    if (topMerchants.length < TOP_MERCHANTS_LIMIT) {
      topMerchants.push(unknownMerchant);
    } else {
      topMerchants[topMerchants.length - 1] = unknownMerchant;
    }
  }

  return topMerchants;
}

function aggregateInstallmentsByMerchant(transactions: TransactionSummary[]): MerchantInstallmentsItem[] {
  const totals = new Map<string, MerchantInstallmentsItem>();

  transactions.forEach((transaction) => {
    const metadata = transaction.credit_card_metadata;
    if (!metadata?.installmentNumber || !metadata.totalInstallments || metadata.totalInstallments <= 1) {
      return;
    }

    const merchant = getMerchantName(transaction);
    const amount = transaction.amount;
    const current = totals.get(merchant) ?? { merchant, total: 0, pending: 0 };
    const remainingInstallments = Math.max(0, metadata.totalInstallments - metadata.installmentNumber);

    current.total += amount;
    current.pending += amount * remainingInstallments;

    totals.set(merchant, current);
  });

  return [...totals.values()].sort((a, b) => b.total - a.total);
}

function getMerchantName(transaction: TransactionSummary): string {
  return transaction.merchant?.name?.trim() || transaction.merchant?.businessName?.trim() || UNKNOWN_MERCHANT;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function buildCategoryMonthlySpendData(params: {
  accounts: AccountSummary[];
  transactions: TransactionSummary[];
  today?: Date;
}): CategoryMonthlySpendData {
  const referenceDate = params.today ?? new Date();
  const monthStarts: Date[] = [];

  for (let offset = CATEGORY_MONTHS_RANGE - 1; offset >= 0; offset -= 1) {
    monthStarts.push(new Date(referenceDate.getFullYear(), referenceDate.getMonth() - offset, 1));
  }

  const monthLabels = monthStarts.map((monthStart) =>
    monthStart.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }).replace('.', ''),
  );
  const monthKeys = monthStarts.map((monthStart) => `${monthStart.getFullYear()}-${monthStart.getMonth()}`);

  const startDate = toInputDate(monthStarts[0]);
  const endDate = toInputDate(new Date(referenceDate.getFullYear(), referenceDate.getMonth() + 1, 0));
  const transactions = getCreditCardTransactionsInRange({
    accounts: params.accounts,
    transactions: params.transactions,
    startDate,
    endDate,
  });

  const categoryBuckets = new Map<string, number[]>();

  transactions.forEach((transaction) => {
    const transactionDate = new Date(transaction.date);
    const monthKey = `${transactionDate.getFullYear()}-${transactionDate.getMonth()}`;
    const monthIndex = monthKeys.indexOf(monthKey);
    if (monthIndex === -1) {
      return;
    }

    const category = transaction.category?.trim() || UNKNOWN_LABEL;
    const costs = categoryBuckets.get(category) ?? new Array(CATEGORY_MONTHS_RANGE).fill(0);
    costs[monthIndex] += transaction.amount;
    categoryBuckets.set(category, costs);
  });

  const items = [...categoryBuckets.entries()]
    .map(([category, monthlyCosts]) => ({ category, monthlyCosts }))
    .sort((a, b) => b.monthlyCosts.reduce((sum, value) => sum + value, 0) - a.monthlyCosts.reduce((sum, value) => sum + value, 0))
    .slice(0, TOP_CATEGORIES_LIMIT);

  return { monthLabels, items };
}

function toDateOnly(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function toInputDate(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}
