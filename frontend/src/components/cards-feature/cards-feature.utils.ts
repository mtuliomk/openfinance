import type { AccountSummary } from '../../services/proxy-api/proxy-api.types';
import { CREDIT_CARD_SUBTYPE, type CardsFeatureCardData } from './cards-feature.types';

const UNKNOWN_LABEL = '-';

export function toCardsFeatureCardData(accounts: AccountSummary[]): CardsFeatureCardData[] {
  return accounts
    .filter((account) => account.subtype === CREDIT_CARD_SUBTYPE)
    .map((account) => ({
      id: account.id,
      holder: account.name ?? UNKNOWN_LABEL,
      number: account.number ?? UNKNOWN_LABEL,
      brand: parseBrandFromTransferNumber(account.bankData?.transferNumber ?? null),
      balanceLabel: formatCurrency(account.balance),
    }));
}

export function parseBrandFromTransferNumber(transferNumber: string | null): string {
  if (!transferNumber) {
    return UNKNOWN_LABEL;
  }

  const [, brand] = transferNumber.split('/');
  const normalized = (brand ?? '').trim();

  return normalized.length > 0 ? normalized : UNKNOWN_LABEL;
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
