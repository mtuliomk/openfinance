import type { AccountCreateInput } from '../account/account.types.js';
import type { ItemUpdateInput } from '../items/items.types.js';
import type { InvestmentCreateInput } from '../investment/investment.types.js';
import type { ConsentCreateInput } from '../consent/consent.types.js';
import type { IdentityCreateInput } from '../identity/identity.types.js';
import type { LoanCreateInput } from '../loan/loan.types.js';
import type { BillCreateInput } from '../bill/bill.types.js';
import type { TransactionCreateInput } from '../transaction/transaction.types.js';
import type { PluggyAccount } from './openfinance-reload.types.js';

function toNumberOrNull(value: unknown): number | null {
  return typeof value === 'number' ? value : null;
}

function toIsoDateOrNull(value: unknown): string | null {
  if (value instanceof Date) {
    return value.toISOString();
  }
  return typeof value === 'string' ? value : null;
}

function normalizeBankData(raw: unknown): PluggyAccount['bankData'] {
  if (!raw || typeof raw !== 'object') {
    return null;
  }

  const data = raw as Record<string, unknown>;
  return {
    transferNumber: typeof data.transferNumber === 'string' ? data.transferNumber : null,
    closingBalance: toNumberOrNull(data.closingBalance),
    automaticallyInvestedBalance: toNumberOrNull(data.automaticallyInvestedBalance),
    overdraftUsedLimit: toNumberOrNull(data.overdraftUsedLimit),
    unarrangedOverdraftAmount: toNumberOrNull(data.unarrangedOverdraftAmount)
  };
}

function normalizeCreditData(raw: unknown): PluggyAccount['creditData'] {
  if (!raw || typeof raw !== 'object') {
    return null;
  }

  const data = raw as Record<string, unknown>;

  return {
    level: typeof data.level === 'string' ? data.level : null,
    brand: typeof data.brand === 'string' ? data.brand : null,
    balanceCloseDate: data.balanceCloseDate instanceof Date ? data.balanceCloseDate.toISOString() : null,
    balanceDueDate: data.balanceDueDate instanceof Date ? data.balanceDueDate.toISOString() : null,
    availableCreditLimit: toNumberOrNull(data.availableCreditLimit),
    balanceForeignCurrency: toNumberOrNull(data.balanceForeignCurrency),
    minimumPayment: toNumberOrNull(data.minimumPayment),
    creditLimit: toNumberOrNull(data.creditLimit),
    isLimitFlexible: typeof data.isLimitFlexible === 'boolean' ? data.isLimitFlexible : null,
    status:
      data.status === 'ACTIVE' || data.status === 'BLOCKED' || data.status === 'CANCELLED'
        ? data.status
        : null,
    holderType: data.holderType === 'MAIN' || data.holderType === 'ADDITIONAL' ? data.holderType : null
  };
}

export function toAccountCreateInput(account: PluggyAccount): AccountCreateInput {
  return {
    id: account.id,
    type: account.type,
    itemId: account.itemId,
    subtype: account.subtype ?? undefined,
    number: account.number ?? undefined,
    name: account.name ?? undefined,
    marketingName: account.marketingName ?? undefined,
    balance: account.balance ?? undefined,
    taxNumber: account.taxNumber ?? undefined,
    owner: account.owner ?? undefined,
    currencyCode: account.currencyCode ?? undefined,
    bankData: account.bankData ?? undefined,
    creditData: account.creditData ?? undefined
  };
}

export function normalizePluggyAccount(raw: unknown, fallbackItemId: string): PluggyAccount {
  const data = raw as Record<string, unknown>;

  return {
    id: String(data.id ?? ''),
    type: typeof data.type === 'string' ? data.type : 'UNKNOWN',
    itemId: typeof data.itemId === 'string' ? data.itemId : fallbackItemId,
    subtype: typeof data.subtype === 'string' ? data.subtype : null,
    number: typeof data.number === 'string' ? data.number : null,
    name: typeof data.name === 'string' ? data.name : null,
    marketingName: typeof data.marketingName === 'string' ? data.marketingName : null,
    balance: typeof data.balance === 'number' ? data.balance : null,
    taxNumber: typeof data.taxNumber === 'string' ? data.taxNumber : null,
    owner: typeof data.owner === 'string' ? data.owner : null,
    currencyCode: typeof data.currencyCode === 'string' ? data.currencyCode : null,
    bankData: normalizeBankData(data.bankData),
    creditData: normalizeCreditData(data.creditData)
  };
}

export function toItemUpdateInput(raw: unknown): ItemUpdateInput {
  const data = raw as Record<string, unknown>;

  return {
    provider: undefined,
    connector: typeof data.connector === 'object' ? (data.connector as Record<string, unknown>) : null,
    status: typeof data.status === 'string' ? data.status : undefined,
    executionStatus: typeof data.executionStatus === 'string' ? data.executionStatus : undefined,
    lastUpdatedAt: toIsoDateOrNull(data.lastUpdatedAt),
    webhookUrl: typeof data.webhookUrl === 'string' ? data.webhookUrl : null,
    error: typeof data.error === 'object' ? (data.error as Record<string, unknown>) : null,
    clientUserId:
      typeof data.clientUserId === 'string' || data.clientUserId === null
        ? (data.clientUserId as string | null)
        : undefined,
    consecutiveFailedLoginAttempts:
      typeof data.consecutiveFailedLoginAttempts === 'number'
        ? data.consecutiveFailedLoginAttempts
        : undefined,
    statusDetail:
      typeof data.statusDetail === 'object' ? (data.statusDetail as Record<string, unknown>) : null,
    parameter: typeof data.parameter === 'object' ? (data.parameter as Record<string, unknown>) : null,
    userAction: typeof data.userAction === 'object' ? (data.userAction as Record<string, unknown>) : null,
    nextAutoSyncAt: toIsoDateOrNull(data.nextAutoSyncAt),
    consentExpiresAt: typeof data.consentExpiresAt === 'string' ? data.consentExpiresAt : null,
    products: Array.isArray(data.products) ? data.products.filter((p): p is string => typeof p === 'string') : undefined,
    oauthRedirectUri: typeof data.oauthRedirectUri === 'string' ? data.oauthRedirectUri : null
  };
}

export function toTransactionCreateInput(raw: unknown, fallbackAccountId: string): TransactionCreateInput {
  const data = raw as Record<string, unknown>;

  return {
    id: String(data.id ?? ''),
    accountId: typeof data.accountId === 'string' ? data.accountId : fallbackAccountId,
    date: toIsoDateOrNull(data.date) ?? new Date().toISOString(),
    description: typeof data.description === 'string' ? data.description : '',
    descriptionRaw: typeof data.descriptionRaw === 'string' ? data.descriptionRaw : null,
    type: data.type === 'DEBIT' ? 'DEBIT' : 'CREDIT',
    amount: typeof data.amount === 'number' ? data.amount : 0,
    amountInAccountCurrency: toNumberOrNull(data.amountInAccountCurrency),
    balance: typeof data.balance === 'number' ? data.balance : 0,
    currencyCode: typeof data.currencyCode === 'string' ? data.currencyCode : 'BRL',
    category: typeof data.category === 'string' ? data.category : null,
    status: data.status === 'PENDING' || data.status === 'POSTED' ? data.status : null,
    providerCode: typeof data.providerCode === 'string' ? data.providerCode : null,
    paymentData: typeof data.paymentData === 'object' ? (data.paymentData as TransactionCreateInput['paymentData']) : null,
    creditCardMetadata:
      typeof data.creditCardMetadata === 'object'
        ? (data.creditCardMetadata as TransactionCreateInput['creditCardMetadata'])
        : null,
    merchant: typeof data.merchant === 'object' ? (data.merchant as TransactionCreateInput['merchant']) : null,
    categoryId: typeof data.categoryId === 'string' ? data.categoryId : null,
    operationType: typeof data.operationType === 'string' ? data.operationType : null,
    providerId: typeof data.providerId === 'string' ? data.providerId : null,
    createdAt: toIsoDateOrNull(data.createdAt) ?? new Date().toISOString(),
    updatedAt: toIsoDateOrNull(data.updatedAt) ?? new Date().toISOString()
  };
}

export function toInvestmentCreateInput(raw: unknown, fallbackItemId: string): InvestmentCreateInput {
  const data = raw as Record<string, unknown>;
  const now = new Date().toISOString();

  return {
    id: String(data.id ?? ''),
    itemId: typeof data.itemId === 'string' ? data.itemId : fallbackItemId,
    code: typeof data.code === 'string' ? data.code : null,
    issuerCnpj: typeof data.issuerCNPJ === 'string' ? data.issuerCNPJ : null,
    number: typeof data.number === 'string' ? data.number : null,
    isin: typeof data.isin === 'string' ? data.isin : null,
    type:
      data.type === 'MUTUAL_FUND' ||
      data.type === 'SECURITY' ||
      data.type === 'EQUITY' ||
      data.type === 'COE' ||
      data.type === 'FIXED_INCOME' ||
      data.type === 'ETF'
        ? data.type
        : 'OTHER',
    subtype: typeof data.subtype === 'string' ? data.subtype : null,
    status:
      data.status === 'ACTIVE' || data.status === 'PENDING' || data.status === 'TOTAL_WITHDRAWAL'
        ? data.status
        : null,
    name: typeof data.name === 'string' ? data.name : '',
    currencyCode: typeof data.currencyCode === 'string' ? data.currencyCode : 'BRL',
    date: toIsoDateOrNull(data.date),
    dueDate: toIsoDateOrNull(data.dueDate),
    issueDate: toIsoDateOrNull(data.issueDate),
    purchaseDate: toIsoDateOrNull(data.purchaseDate),
    value: toNumberOrNull(data.value),
    quantity: toNumberOrNull(data.quantity),
    taxes: toNumberOrNull(data.taxes),
    taxes2: toNumberOrNull(data.taxes2),
    balance: typeof data.balance === 'number' ? data.balance : 0,
    amount: toNumberOrNull(data.amount),
    amountWithdrawal: toNumberOrNull(data.amountWithdrawal),
    amountProfit: toNumberOrNull(data.amountProfit),
    amountOriginal: toNumberOrNull(data.amountOriginal),
    issuer: typeof data.issuer === 'string' ? data.issuer : null,
    rate: toNumberOrNull(data.rate),
    rateType: typeof data.rateType === 'string' ? data.rateType : null,
    fixedAnnualRate: toNumberOrNull(data.fixedAnnualRate),
    lastMonthRate: toNumberOrNull(data.lastMonthRate),
    annualRate: toNumberOrNull(data.annualRate),
    lastTwelveMonthsRate: toNumberOrNull(data.lastTwelveMonthsRate),
    owner: typeof data.owner === 'string' ? data.owner : null,
    metadata:
      typeof data.metadata === 'object' && data.metadata
        ? {
            taxRegime:
              typeof (data.metadata as Record<string, unknown>).taxRegime === 'string'
                ? ((data.metadata as Record<string, unknown>).taxRegime as string)
                : null,
            proposalNumber:
              typeof (data.metadata as Record<string, unknown>).proposalNumber === 'string'
                ? ((data.metadata as Record<string, unknown>).proposalNumber as string)
                : null,
            processNumber:
              typeof (data.metadata as Record<string, unknown>).processNumber === 'string'
                ? ((data.metadata as Record<string, unknown>).processNumber as string)
                : null
          }
        : null,
    institution:
      typeof data.institution === 'object' && data.institution
        ? {
            name:
              typeof (data.institution as Record<string, unknown>).name === 'string'
                ? ((data.institution as Record<string, unknown>).name as string)
                : null,
            number:
              typeof (data.institution as Record<string, unknown>).number === 'string'
                ? ((data.institution as Record<string, unknown>).number as string)
                : null
          }
        : null,
    createdAt: now,
    updatedAt: now
  };
}

export function toConsentCreateInput(raw: unknown, fallbackItemId: string): ConsentCreateInput {
  const data = raw as Record<string, unknown>;

  return {
    id: String(data.id ?? ''),
    itemId: fallbackItemId,
    products: Array.isArray(data.products)
      ? data.products.filter((product): product is string => typeof product === 'string')
      : [],
    openFinancePermissionsGranted: Array.isArray(data.openFinancePermissionsGranted)
      ? data.openFinancePermissionsGranted.filter(
          (permission): permission is string => typeof permission === 'string'
        )
      : [],
    createdAt: toIsoDateOrNull(data.createdAt) ?? new Date().toISOString(),
    expiresAt: toIsoDateOrNull(data.expiresAt),
    revokedAt: toIsoDateOrNull(data.revokedAt)
  };
}

function toRecordArrayOrNull(value: unknown): Record<string, unknown>[] | null {
  if (!Array.isArray(value)) return null;
  return value.filter((entry): entry is Record<string, unknown> => typeof entry === 'object' && entry !== null);
}

function toRecordOrNull(value: unknown): Record<string, unknown> | null {
  return typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : null;
}

export function toIdentityCreateInput(raw: unknown, fallbackItemId: string): IdentityCreateInput {
  const data = raw as Record<string, unknown>;
  const now = new Date().toISOString();

  return {
    id: String(data.id ?? ''),
    itemId: fallbackItemId,
    birthDate: toIsoDateOrNull(data.birthDate),
    taxNumber: typeof data.taxNumber === 'string' ? data.taxNumber : null,
    document: typeof data.document === 'string' ? data.document : null,
    documentType: typeof data.documentType === 'string' ? data.documentType : null,
    jobTitle: typeof data.jobTitle === 'string' ? data.jobTitle : null,
    companyName: typeof data.companyName === 'string' ? data.companyName : null,
    fullName: typeof data.fullName === 'string' ? data.fullName : null,
    phoneNumbers: toRecordArrayOrNull(data.phoneNumbers),
    emails: toRecordArrayOrNull(data.emails),
    addresses: toRecordArrayOrNull(data.addresses),
    relations: toRecordArrayOrNull(data.relations),
    investorProfile:
      data.investorProfile === 'Conservative' ||
      data.investorProfile === 'Moderate' ||
      data.investorProfile === 'Aggressive'
        ? data.investorProfile
        : null,
    establishmentName: typeof data.establishmentName === 'string' ? data.establishmentName : null,
    establishmentCode: typeof data.establishmentCode === 'string' ? data.establishmentCode : null,
    financialRelationships: toRecordOrNull(data.financialRelationships),
    qualifications: toRecordOrNull(data.qualifications),
    socialName: typeof data.socialName === 'string' ? data.socialName : null,
    sex: data.sex === 'FEMALE' || data.sex === 'MALE' || data.sex === 'OTHER' ? data.sex : null,
    maritalStatus: toRecordOrNull(data.maritalStatus),
    nationality: toRecordOrNull(data.nationality),
    otherDocuments: toRecordArrayOrNull(data.otherDocuments),
    passport: toRecordOrNull(data.passport),
    incorporationDate: toIsoDateOrNull(data.incorporationDate),
    parties: toRecordArrayOrNull(data.parties),
    businessOtherDocuments: toRecordArrayOrNull(data.businessOtherDocuments),
    companiesCnpj: Array.isArray(data.companiesCnpj)
      ? data.companiesCnpj.filter((entry): entry is string => typeof entry === 'string')
      : null,
    createdAt: toIsoDateOrNull(data.createdAt) ?? now,
    updatedAt: toIsoDateOrNull(data.updatedAt) ?? now
  };
}

export function toLoanCreateInput(raw: unknown, fallbackItemId: string): LoanCreateInput {
  const data = raw as Record<string, unknown>;

  return {
    id: String(data.id ?? ''),
    itemId: fallbackItemId,
    contractNumber: typeof data.contractNumber === 'string' ? data.contractNumber : null,
    ipocCode: typeof data.ipocCode === 'string' ? data.ipocCode : null,
    productName: typeof data.productName === 'string' ? data.productName : '',
    type: typeof data.type === 'string' ? data.type : null,
    date: toIsoDateOrNull(data.date),
    contractDate: toIsoDateOrNull(data.contractDate),
    disbursementDates: Array.isArray(data.disbursementDates)
      ? data.disbursementDates
          .map((entry) => toIsoDateOrNull(entry))
          .filter((entry): entry is string => entry !== null)
      : null,
    settlementDate: toIsoDateOrNull(data.settlementDate),
    contractAmount: toNumberOrNull(data.contractAmount),
    currencyCode: typeof data.currencyCode === 'string' ? data.currencyCode : 'BRL',
    dueDate: toIsoDateOrNull(data.dueDate),
    installmentPeriodicity:
      typeof data.installmentPeriodicity === 'string' ? data.installmentPeriodicity : null,
    installmentPeriodicityAdditionalInfo:
      typeof data.installmentPeriodicityAdditionalInfo === 'string'
        ? data.installmentPeriodicityAdditionalInfo
        : null,
    firstInstallmentDueDate: toIsoDateOrNull(data.firstInstallmentDueDate),
    cet: toNumberOrNull(data.CET),
    amortizationScheduled:
      typeof data.amortizationScheduled === 'string' ? data.amortizationScheduled : null,
    amortizationScheduledAdditionalInfo:
      typeof data.amortizationScheduledAdditionalInfo === 'string'
        ? data.amortizationScheduledAdditionalInfo
        : null,
    cnpjConsignee: typeof data.cnpjConsignee === 'string' ? data.cnpjConsignee : null,
    interestRates: toRecordArrayOrNull(data.interestRates),
    contractedFees: toRecordArrayOrNull(data.contractedFees),
    contractedFinanceCharges: toRecordArrayOrNull(data.contractedFinanceCharges),
    warranties: toRecordArrayOrNull(data.warranties),
    installments: toRecordOrNull(data.installments),
    payments: toRecordOrNull(data.payments)
  };
}

export function toBillCreateInput(raw: unknown, fallbackAccountId: string): BillCreateInput {
  const data = raw as Record<string, unknown>;

  return {
    id: String(data.id ?? ''),
    accountId: fallbackAccountId,
    dueDate: toIsoDateOrNull(data.dueDate) ?? new Date().toISOString(),
    totalAmount: typeof data.totalAmount === 'number' ? data.totalAmount : 0,
    totalAmountCurrencyCode:
      typeof data.totalAmountCurrencyCode === 'string' ? data.totalAmountCurrencyCode : 'BRL',
    minimumPaymentAmount: toNumberOrNull(data.minimumPaymentAmount),
    allowsInstallments:
      typeof data.allowsInstallments === 'boolean' ? data.allowsInstallments : null,
    financeCharges: toRecordArrayOrNull(data.financeCharges) ?? [],
    createdAt: toIsoDateOrNull(data.createdAt) ?? new Date().toISOString(),
    updatedAt: toIsoDateOrNull(data.updatedAt) ?? new Date().toISOString()
  };
}
