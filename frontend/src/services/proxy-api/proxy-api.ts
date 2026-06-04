import type {
  AccountSummary,
  InvestmentSummary,
  OpenFinanceReloadResult,
  ProxyRequestConfig,
  TransactionSummary,
} from './proxy-api.types';
import { normalizePath } from './proxy-api.utils';
import { clearPersistedSession } from '../../state/auth-session/auth-session';
import { AUTH_SESSION_STORAGE_KEY } from '../../state/auth-session/auth-session.types';
import { startNetworkLoading } from '../../state/network-loading/network-loading';

export function buildProxyUrl(config: ProxyRequestConfig): string {
  const baseUrl = import.meta.env.VITE_PROXY_BASE_URL ?? '';
  return `${baseUrl}${normalizePath(config.path)}`;
}

async function fetchFromProxy(input: string, init: RequestInit): Promise<Response> {
  const stopNetworkLoading = startNetworkLoading();

  try {
    const response = await fetch(input, init);
    if (response.status === 401) {
      clearPersistedSession();
      window.history.replaceState({}, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }

    return response;
  } finally {
    stopNetworkLoading();
  }
}

function toBase64Url(input: string): string {
  return btoa(input).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function buildFrontendBearerToken(): string {
  const rawSession = window.localStorage.getItem(AUTH_SESSION_STORAGE_KEY);
  if (!rawSession) {
    return 'Bearer frontend-session';
  }

  try {
    const parsed = JSON.parse(rawSession) as { email?: unknown };
    if (typeof parsed.email !== 'string' || parsed.email.length === 0) {
      return 'Bearer frontend-session';
    }
    const header = toBase64Url(JSON.stringify({ alg: 'none', typ: 'JWT' }));
    const payload = toBase64Url(JSON.stringify({ email: parsed.email }));
    return `Bearer ${header}.${payload}.signature`;
  } catch {
    return 'Bearer frontend-session';
  }
}

export async function listAccounts(): Promise<AccountSummary[]> {
  const response = await fetchFromProxy(buildProxyUrl({ path: '/account', method: 'GET' }), {
    method: 'GET',
    headers: {
      authorization: buildFrontendBearerToken(),
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

    const candidate = item as {
      id?: unknown;
      name?: unknown;
      balance?: unknown;
      subtype?: unknown;
      type?: unknown;
      number?: unknown;
      bankData?: unknown;
      bank_data?: unknown;
    };
    if (typeof candidate.id !== 'string') {
      return [];
    }

    return [
      {
        id: candidate.id,
        name: typeof candidate.name === 'string' ? candidate.name : null,
        balance: typeof candidate.balance === 'number' ? candidate.balance : null,
        subtype: typeof candidate.subtype === 'string' ? candidate.subtype : null,
        type: typeof candidate.type === 'string' ? candidate.type : null,
        number: typeof candidate.number === 'string' ? candidate.number : null,
        bankData: mapBankData(candidate.bankData, candidate.bank_data),
      },
    ];
  });
}

function mapBankData(bankDataCamelCase: unknown, bankDataSnakeCase: unknown): { transferNumber?: string | null } | null {
  const source =
    bankDataCamelCase && typeof bankDataCamelCase === 'object'
      ? bankDataCamelCase
      : bankDataSnakeCase && typeof bankDataSnakeCase === 'object'
        ? bankDataSnakeCase
        : null;

  if (!source) {
    return null;
  }

  if (!('transferNumber' in source)) {
    return null;
  }

  const transferNumber = (source as { transferNumber?: unknown }).transferNumber;
  return {
    transferNumber: typeof transferNumber === 'string' ? transferNumber : null,
  };
}

export async function listInvestments(): Promise<InvestmentSummary[]> {
  const response = await fetchFromProxy(buildProxyUrl({ path: '/investment', method: 'GET' }), {
    method: 'GET',
    headers: {
      authorization: buildFrontendBearerToken(),
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

export async function listTransactions(): Promise<TransactionSummary[]> {
  const response = await fetchFromProxy(buildProxyUrl({ path: '/transaction', method: 'GET' }), {
    method: 'GET',
    headers: {
      authorization: buildFrontendBearerToken(),
    },
  });

  if (!response.ok) {
    throw new Error('Failed to load transactions');
  }

  const payload: unknown = await response.json();
  const transactionListPayload =
    payload && typeof payload === 'object' && 'body' in payload
      ? (payload as { body?: unknown }).body
      : payload;

  if (!Array.isArray(transactionListPayload)) {
    return [];
  }

  return transactionListPayload.flatMap((item) => {
    if (!item || typeof item !== 'object') {
      return [];
    }

    const candidate = item as {
      id?: unknown;
      accountId?: unknown;
      description?: unknown;
      amount?: unknown;
      date?: unknown;
      category?: unknown;
      type?: unknown;
      operationType?: unknown;
      paymentData?: unknown;
      merchant?: unknown;
      creditCardMetadata?: unknown;
      credit_card_metadata?: unknown;
    };

    if (
      typeof candidate.id !== 'string' ||
      typeof candidate.accountId !== 'string' ||
      typeof candidate.description !== 'string' ||
      typeof candidate.amount !== 'number' ||
      typeof candidate.date !== 'string'
    ) {
      return [];
    }

    return [
      {
        id: candidate.id,
        accountId: candidate.accountId,
        description: candidate.description,
        amount: candidate.amount,
        date: candidate.date,
        category: typeof candidate.category === 'string' ? candidate.category : null,
        type: typeof candidate.type === 'string' ? candidate.type : null,
        operationType: typeof candidate.operationType === 'string' ? candidate.operationType : null,
        merchant: mapTransactionMerchant(candidate.merchant),
        credit_card_metadata: mapCreditCardMetadata(candidate.creditCardMetadata, candidate.credit_card_metadata),
        paymentData: mapTransactionPaymentData(candidate.paymentData),
      },
    ];
  });
}

function mapTransactionMerchant(merchant: unknown): TransactionSummary['merchant'] {
  if (!merchant || typeof merchant !== 'object') {
    return null;
  }

  const merchantData = merchant as { name?: unknown; businessName?: unknown; cnpj?: unknown };

  return {
    name: typeof merchantData.name === 'string' ? merchantData.name : null,
    businessName: typeof merchantData.businessName === 'string' ? merchantData.businessName : null,
    cnpj: typeof merchantData.cnpj === 'string' ? merchantData.cnpj : null,
  };
}

function mapCreditCardMetadata(
  creditCardMetadataCamelCase: unknown,
  creditCardMetadataSnakeCase: unknown,
): TransactionSummary['credit_card_metadata'] {
  const source =
    creditCardMetadataCamelCase && typeof creditCardMetadataCamelCase === 'object'
      ? creditCardMetadataCamelCase
      : creditCardMetadataSnakeCase && typeof creditCardMetadataSnakeCase === 'object'
        ? creditCardMetadataSnakeCase
        : null;

  if (!source) {
    return null;
  }

  const metadata = source as { billId?: unknown; installmentNumber?: unknown; totalInstallments?: unknown };

  return {
    billId: typeof metadata.billId === 'string' ? metadata.billId : null,
    installmentNumber: typeof metadata.installmentNumber === 'number' ? metadata.installmentNumber : null,
    totalInstallments: typeof metadata.totalInstallments === 'number' ? metadata.totalInstallments : null,
  };
}

export async function reloadOpenFinance(): Promise<OpenFinanceReloadResult> {
  const response = await fetchFromProxy(buildProxyUrl({ path: '/openfinance/reload', method: 'POST' }), {
    method: 'POST',
    headers: {
      authorization: buildFrontendBearerToken(),
    },
  });

  const payload: unknown = await response.json().catch(() => null);
  const body = payload && typeof payload === 'object' && 'body' in payload ? (payload as { body?: unknown }).body : payload;

  if (!response.ok) {
    throw new Error(`Failed to reload openfinance (${response.status})`);
  }

  return {
    statusCode: response.status,
    body,
  };
}

function mapTransactionPaymentData(paymentData: unknown): TransactionSummary['paymentData'] {
  if (!paymentData || typeof paymentData !== 'object') {
    return null;
  }

  const payer = 'payer' in paymentData ? (paymentData as { payer?: unknown }).payer : null;
  const receiver = 'receiver' in paymentData ? (paymentData as { receiver?: unknown }).receiver : null;
  const mappedPayer = mapTransactionParticipant(payer);
  const mappedReceiver = mapTransactionParticipant(receiver);

  return {
    payer: mappedPayer,
    receiver: mappedReceiver,
  };
}

function mapTransactionParticipant(participant: unknown): {
  documentNumber: { value: string | null } | null;
  name: string | null;
  routingNumber: string | null;
  branchNumber: string | null;
  accountNumber: string | null;
} | null {
  if (!participant || typeof participant !== 'object') {
    return null;
  }

  const documentNumber =
    'documentNumber' in participant &&
    (participant as { documentNumber?: unknown }).documentNumber &&
    typeof (participant as { documentNumber?: unknown }).documentNumber === 'object'
      ? ((participant as { documentNumber?: { value?: unknown } }).documentNumber ?? null)
      : null;

  return {
    documentNumber: documentNumber ? { value: typeof documentNumber.value === 'string' ? documentNumber.value : null } : null,
    name:
      'name' in participant && typeof (participant as { name?: unknown }).name === 'string'
        ? ((participant as { name?: string }).name ?? null)
        : null,
    routingNumber:
      'routingNumber' in participant && typeof (participant as { routingNumber?: unknown }).routingNumber === 'string'
        ? ((participant as { routingNumber?: string }).routingNumber ?? null)
        : null,
    branchNumber:
      'branchNumber' in participant && typeof (participant as { branchNumber?: unknown }).branchNumber === 'string'
        ? ((participant as { branchNumber?: string }).branchNumber ?? null)
        : null,
    accountNumber:
      'accountNumber' in participant && typeof (participant as { accountNumber?: unknown }).accountNumber === 'string'
        ? ((participant as { accountNumber?: string }).accountNumber ?? null)
        : null,
  };
}
