import type { AppShellNavItem } from './app-shell.types';
import type { HomeFeatureKey } from '../../routes/home/home.types';

export const APP_SHELL_NAV_ITEMS: AppShellNavItem[] = [
  { feature: 'home', label: 'Dashboard' },
  { feature: 'transactions', label: 'Transactions' },
  {
    feature: 'contas',
    label: 'Accounts',
    children: [
      { feature: 'contas', label: 'Checking Account' },
      { feature: 'cartoes', label: 'Savings' },
      { feature: 'investimentos', label: 'Investment Portfolio' },
      { feature: 'analise', label: 'Budgets' },
    ],
  },
  { feature: 'atualizar', label: 'Settings' },
];

export function getAppShellTitle(feature: HomeFeatureKey): string {
  for (const item of APP_SHELL_NAV_ITEMS) {
    if (item.feature === feature) {
      return item.label;
    }

    const child = item.children?.find((nestedItem) => nestedItem.feature === feature);
    if (child) {
      return child.label;
    }
  }

  return 'Dashboard';
}
