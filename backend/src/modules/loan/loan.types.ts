export interface LoanRecord {
  id: string;
  itemId: string;
  contractNumber: string | null;
  ipocCode: string | null;
  productName: string;
  type: string | null;
  date: string | null;
  contractDate: string | null;
  disbursementDates: string[] | null;
  settlementDate: string | null;
  contractAmount: number | null;
  currencyCode: string;
  dueDate: string | null;
  installmentPeriodicity: string | null;
  installmentPeriodicityAdditionalInfo: string | null;
  firstInstallmentDueDate: string | null;
  cet: number | null;
  amortizationScheduled: string | null;
  amortizationScheduledAdditionalInfo: string | null;
  cnpjConsignee: string | null;
  interestRates: Record<string, unknown>[] | null;
  contractedFees: Record<string, unknown>[] | null;
  contractedFinanceCharges: Record<string, unknown>[] | null;
  warranties: Record<string, unknown>[] | null;
  installments: Record<string, unknown> | null;
  payments: Record<string, unknown> | null;
}

export type LoanCreateInput = LoanRecord;

export interface LoanUpdateInput {
  itemId?: string | undefined;
  contractNumber?: string | null | undefined;
  ipocCode?: string | null | undefined;
  productName?: string | undefined;
  type?: string | null | undefined;
  date?: string | null | undefined;
  contractDate?: string | null | undefined;
  disbursementDates?: string[] | null | undefined;
  settlementDate?: string | null | undefined;
  contractAmount?: number | null | undefined;
  currencyCode?: string | undefined;
  dueDate?: string | null | undefined;
  installmentPeriodicity?: string | null | undefined;
  installmentPeriodicityAdditionalInfo?: string | null | undefined;
  firstInstallmentDueDate?: string | null | undefined;
  cet?: number | null | undefined;
  amortizationScheduled?: string | null | undefined;
  amortizationScheduledAdditionalInfo?: string | null | undefined;
  cnpjConsignee?: string | null | undefined;
  interestRates?: Record<string, unknown>[] | null | undefined;
  contractedFees?: Record<string, unknown>[] | null | undefined;
  contractedFinanceCharges?: Record<string, unknown>[] | null | undefined;
  warranties?: Record<string, unknown>[] | null | undefined;
  installments?: Record<string, unknown> | null | undefined;
  payments?: Record<string, unknown> | null | undefined;
}

export interface LoanRepository {
  create(input: LoanCreateInput): Promise<LoanRecord>;
  list(): Promise<LoanRecord[]>;
  getById(id: string): Promise<LoanRecord | null>;
  updateById(id: string, input: LoanUpdateInput): Promise<LoanRecord | null>;
  deleteById(id: string): Promise<boolean>;
}
