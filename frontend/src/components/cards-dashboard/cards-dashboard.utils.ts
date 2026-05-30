import type { AccountSummary } from '../../services/proxy-api/proxy-api.types';
import type { CardsDashboardData } from './cards-dashboard.types';

const CREDIT_CARD_SUBTYPE = 'CREDIT_CARD';

export function toCardsDashboardData(accounts: AccountSummary[]): CardsDashboardData {
  const creditCardAccounts = accounts.filter((account) => account.subtype === CREDIT_CARD_SUBTYPE);

  const totalBalance = creditCardAccounts.reduce((total, account) => {
    if (typeof account.balance !== 'number') {
      return total;
    }

    return total + account.balance;
  }, 0);

  const maxInvoice = creditCardAccounts.reduce((maxValue, account) => {
    if (typeof account.balance !== 'number') {
      return maxValue;
    }

    return Math.max(maxValue, account.balance);
  }, 0);

  return {
    title: 'Cartões',
    count: formatCurrency(totalBalance),
    description: `Maior fatura: ${formatCurrency(maxInvoice)}`,
  };
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}
