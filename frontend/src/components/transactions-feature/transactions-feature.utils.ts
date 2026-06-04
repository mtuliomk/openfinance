import type { AccountSummary, TransactionSummary } from '../../services/proxy-api/proxy-api.types';
import type { TransactionCardSummary, TransactionTableRow } from './transactions-feature.types';

const PAGE_SIZE = 5;

export function getTransactionsPageSize(): number {
  return PAGE_SIZE;
}

export function toTransactionRows(transactions: TransactionSummary[]): TransactionTableRow[] {
  return transactions.map((transaction) => ({
    id: transaction.id,
    dateLabel: formatDate(transaction.date),
    description: transaction.description,
    categoryLabel: transaction.category ?? 'Uncategorized',
    valueLabel: formatSignedCurrency(transaction.amount),
    valueType: transaction.amount > 0 ? 'credit' : transaction.amount < 0 ? 'debit' : 'neutral',
    icon: getTransactionIcon(transaction),
  }));
}

export function toTransactionCardSummary(accounts: AccountSummary[], transactions: TransactionSummary[]): TransactionCardSummary {
  const creditAccount = accounts.find((account) => account.subtype === 'CREDIT_CARD') ?? accounts[0] ?? null;
  const totalDebit = transactions
    .filter((transaction) => transaction.amount < 0)
    .reduce((total, transaction) => total + Math.abs(transaction.amount), 0);

  return {
    title: 'CARD SUMMARY',
    subtitle: creditAccount ? `${creditAccount.name ?? 'Cartao'} ${maskAccountNumber(creditAccount.number)}` : 'Cartao conectado',
    amountLabel: formatCurrency(totalDebit),
  };
}

export function paginateTransactionRows(rows: TransactionTableRow[], page: number): TransactionTableRow[] {
  const start = (Math.max(1, page) - 1) * PAGE_SIZE;
  return rows.slice(start, start + PAGE_SIZE);
}

export function getTotalTransactionPages(totalRows: number): number {
  return Math.max(1, Math.ceil(totalRows / PAGE_SIZE));
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).format(date);
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

function formatSignedCurrency(value: number): string {
  const prefix = value > 0 ? '+ ' : value < 0 ? '- ' : '';
  return `${prefix}${formatCurrency(Math.abs(value))}`;
}

function maskAccountNumber(value: string | null | undefined): string {
  if (!value) {
    return '----';
  }

  const visibleDigits = value.replace(/\D/g, '').slice(-4);
  return visibleDigits ? `---- ${visibleDigits}` : '----';
}

function getTransactionIcon(transaction: TransactionSummary): string {
  const category = transaction.category?.toLowerCase() ?? '';
  const description = transaction.description.toLowerCase();

  if (transaction.amount > 0) return 'down';
  if (category.includes('food') || description.includes('restaurante')) return 'food';
  if (category.includes('transport') || description.includes('uber')) return 'car';
  if (category.includes('service') || description.includes('netflix')) return 'media';
  return 'bag';
}
