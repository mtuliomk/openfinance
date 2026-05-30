export type InvestmentType =
  | 'MUTUAL_FUND'
  | 'SECURITY'
  | 'EQUITY'
  | 'COE'
  | 'FIXED_INCOME'
  | 'ETF'
  | 'OTHER';

export type InvestmentStatus = 'ACTIVE' | 'PENDING' | 'TOTAL_WITHDRAWAL';

export interface InvestmentMetadata {
  taxRegime: string | null;
  proposalNumber: string | null;
  processNumber: string | null;
}

export interface InvestmentInstitution {
  name: string | null;
  number: string | null;
}

export interface InvestmentRecord {
  id: string;
  itemId: string;
  code: string | null;
  issuerCnpj: string | null;
  number: string | null;
  isin: string | null;
  type: InvestmentType;
  subtype: string | null;
  status: InvestmentStatus | null;
  name: string;
  currencyCode: string;
  date: string | null;
  dueDate: string | null;
  issueDate: string | null;
  purchaseDate: string | null;
  value: number | null;
  quantity: number | null;
  taxes: number | null;
  taxes2: number | null;
  balance: number;
  amount: number | null;
  amountWithdrawal: number | null;
  amountProfit: number | null;
  amountOriginal: number | null;
  issuer: string | null;
  rate: number | null;
  rateType: string | null;
  fixedAnnualRate: number | null;
  lastMonthRate: number | null;
  annualRate: number | null;
  lastTwelveMonthsRate: number | null;
  owner: string | null;
  metadata: InvestmentMetadata | null;
  institution: InvestmentInstitution | null;
  createdAt: string;
  updatedAt: string;
}

export interface InvestmentCreateInput extends Omit<InvestmentRecord, 'createdAt' | 'updatedAt'> {
  createdAt?: string | undefined;
  updatedAt?: string | undefined;
}

export interface InvestmentUpdateInput {
  itemId?: string | undefined;
  code?: string | null | undefined;
  issuerCnpj?: string | null | undefined;
  number?: string | null | undefined;
  isin?: string | null | undefined;
  type?: InvestmentType | undefined;
  subtype?: string | null | undefined;
  status?: InvestmentStatus | null | undefined;
  name?: string | undefined;
  currencyCode?: string | undefined;
  date?: string | null | undefined;
  dueDate?: string | null | undefined;
  issueDate?: string | null | undefined;
  purchaseDate?: string | null | undefined;
  value?: number | null | undefined;
  quantity?: number | null | undefined;
  taxes?: number | null | undefined;
  taxes2?: number | null | undefined;
  balance?: number | undefined;
  amount?: number | null | undefined;
  amountWithdrawal?: number | null | undefined;
  amountProfit?: number | null | undefined;
  amountOriginal?: number | null | undefined;
  issuer?: string | null | undefined;
  rate?: number | null | undefined;
  rateType?: string | null | undefined;
  fixedAnnualRate?: number | null | undefined;
  lastMonthRate?: number | null | undefined;
  annualRate?: number | null | undefined;
  lastTwelveMonthsRate?: number | null | undefined;
  owner?: string | null | undefined;
  metadata?: InvestmentMetadata | null | undefined;
  institution?: InvestmentInstitution | null | undefined;
  createdAt?: string | undefined;
  updatedAt?: string | undefined;
}

export interface InvestmentRepository {
  create(input: InvestmentCreateInput): Promise<InvestmentRecord>;
  list(): Promise<InvestmentRecord[]>;
  getById(id: string): Promise<InvestmentRecord | null>;
  updateById(id: string, input: InvestmentUpdateInput): Promise<InvestmentRecord | null>;
  deleteById(id: string): Promise<boolean>;
}
