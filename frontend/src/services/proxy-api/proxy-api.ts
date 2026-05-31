import type {
  AccountSummary,
  InvestmentSummary,
  OpenFinanceReloadResult,
  ProxyRequestConfig,
  TransactionSummary,
} from './proxy-api.types';
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

export async function listTransactions(): Promise<TransactionSummary[]> {
  const response = await fetch(buildProxyUrl({ path: '/transaction', method: 'GET' }), {
    method: 'GET',
    headers: {
      authorization: 'Bearer frontend-session',
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
        paymentData: mapTransactionPaymentData(candidate.paymentData),
      },
    ];
  });
}

export async function reloadOpenFinance(): Promise<OpenFinanceReloadResult> {
  const response = await fetch(buildProxyUrl({ path: '/openfinance/reload', method: 'POST' }), {
    method: 'POST',
    headers: {
      authorization: 'Bearer frontend-session',
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
