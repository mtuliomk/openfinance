import type { AccountSummary } from '../../services/proxy-api/proxy-api.types';
import type { ConnectedAccountsDashboardData } from './connected-accounts-dashboard.types';

export function toConnectedAccountsDashboardData(accounts: AccountSummary[]): ConnectedAccountsDashboardData {
  const checkingAccounts = accounts.filter((account) => account.subtype === 'CHECKING_ACCOUNT');

  const totalBalance = checkingAccounts.reduce((total, account) => {
    if (typeof account.balance !== 'number') {
      return total;
    }

    return total + account.balance;
  }, 0);

  return {
    title: 'Contas',
    count: checkingAccounts.length,
    description: `Saldo total: ${formatCurrency(totalBalance)}`,
  };
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}
