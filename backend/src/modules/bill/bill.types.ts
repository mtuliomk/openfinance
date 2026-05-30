export interface BillRecord {
  id: string;
  accountId: string;
  dueDate: string;
  totalAmount: number;
  totalAmountCurrencyCode: string;
  minimumPaymentAmount: number | null;
  allowsInstallments: boolean | null;
  financeCharges: Record<string, unknown>[];
  createdAt: string;
  updatedAt: string;
}

export type BillCreateInput = BillRecord;

export interface BillUpdateInput {
  accountId?: string | undefined;
  dueDate?: string | undefined;
  totalAmount?: number | undefined;
  totalAmountCurrencyCode?: string | undefined;
  minimumPaymentAmount?: number | null | undefined;
  allowsInstallments?: boolean | null | undefined;
  financeCharges?: Record<string, unknown>[] | undefined;
  createdAt?: string | undefined;
  updatedAt?: string | undefined;
}

export interface BillRepository {
  create(input: BillCreateInput): Promise<BillRecord>;
  list(): Promise<BillRecord[]>;
  getById(id: string): Promise<BillRecord | null>;
  updateById(id: string, input: BillUpdateInput): Promise<BillRecord | null>;
  deleteById(id: string): Promise<boolean>;
}
