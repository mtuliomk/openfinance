import type { AccountSummary, InvestmentSummary, ProxyRequestConfig } from './proxy-api.types';
import { normalizePath } from './proxy-api.utils';

export function buildProxyUrl(config: ProxyRequestConfig): string {
  const baseUrl = import.meta.env.VITE_PROXY_BASE_URL ?? '';
  return `${baseUrl}${normalizePath(config.path)}`;
}

export async function listAccounts(): Promise<AccountSummary[]> {
  const response = await fetch(buildProxyUrl({ path: '/account', method: 'GET' }), {
    method: 'GET',
    headers: {
      authorization: 'Bearer frontend-session',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to load accounts');
  }

  const payload: unknown = await response.json();
  const accountListPayload =
    payload && typeof payload === 'object' && 'body' in payload
      ? (payload as { body?: unknown }).body
      : payload;

  if (!Array.isArray(accountListPayload)) {
    return [];
  }

  return accountListPayload.flatMap((item) => {
    if (!item || typeof item !== 'object') {
      return [];
    }

    const candidate = item as { id?: unknown; name?: unknown; balance?: unknown; subtype?: unknown };
    if (typeof candidate.id !== 'string') {
      return [];
    }

    return [
      {
        id: candidate.id,
        name: typeof candidate.name === 'string' ? candidate.name : null,
        balance: typeof candidate.balance === 'number' ? candidate.balance : null,
        subtype: typeof candidate.subtype === 'string' ? candidate.subtype : null,
      },
    ];
  });
}

export async function listInvestments(): Promise<InvestmentSummary[]> {
  const response = await fetch(buildProxyUrl({ path: '/investment', method: 'GET' }), {
    method: 'GET',
    headers: {
      authorization: 'Bearer frontend-session',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to load investments');
  }

  const payload: unknown = await response.json();
  const investmentListPayload =
    payload && typeof payload === 'object' && 'body' in payload
      ? (payload as { body?: unknown }).body
      : payload;

  if (!Array.isArray(investmentListPayload)) {
    return [];
  }

  return investmentListPayload.flatMap((item) => {
    if (!item || typeof item !== 'object') {
      return [];
    }

    const candidate = item as { id?: unknown; balance?: unknown; purchaseDate?: unknown };
    if (typeof candidate.id !== 'string' || typeof candidate.balance !== 'number') {
      return [];
    }

    return [
      {
        id: candidate.id,
        balance: candidate.balance,
        purchaseDate: typeof candidate.purchaseDate === 'string' ? candidate.purchaseDate : null,
      },
    ];
  });
}
