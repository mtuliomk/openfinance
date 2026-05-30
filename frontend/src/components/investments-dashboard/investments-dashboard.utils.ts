import type { InvestmentSummary } from '../../services/proxy-api/proxy-api.types';
import type { InvestmentsDashboardData } from './investments-dashboard.types';

const THIRTY_DAYS_IN_MS = 30 * 24 * 60 * 60 * 1000;

export function toInvestmentsDashboardData(
  investments: InvestmentSummary[],
  now: Date = new Date(),
): InvestmentsDashboardData {
  const totalBalance = investments.reduce((total, investment) => total + investment.balance, 0);

  const threshold = now.getTime() - THIRTY_DAYS_IN_MS;
  const lastThirtyDaysBalance = investments.reduce((total, investment) => {
    const purchaseDateTimestamp = toTimestamp(investment.purchaseDate);
    if (purchaseDateTimestamp === null || purchaseDateTimestamp < threshold) {
      return total;
    }

    return total + investment.balance;
  }, 0);

  return {
    title: 'Investimentos',
    count: formatCurrency(totalBalance),
    description: `Aporte em 30 dias: ${formatCurrency(lastThirtyDaysBalance)}`,
  };
}

function toTimestamp(value: string | null): number | null {
  if (!value) {
    return null;
  }

  const timestamp = new Date(value).getTime();
  return Number.isNaN(timestamp) ? null : timestamp;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}
