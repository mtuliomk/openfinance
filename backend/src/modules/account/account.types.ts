export interface AccountBankData {
  transferNumber: string | null;
  closingBalance: number | null;
  automaticallyInvestedBalance: number | null;
  overdraftUsedLimit: number | null;
  unarrangedOverdraftAmount: number | null;
}

export interface AccountCreditData {
  level: string | null;
  brand: string | null;
  balanceCloseDate: string | null;
  balanceDueDate: string | null;
  availableCreditLimit: number | null;
  balanceForeignCurrency: number | null;
  minimumPayment: number | null;
  creditLimit: number | null;
  isLimitFlexible: boolean | null;
  status: 'ACTIVE' | 'BLOCKED' | 'CANCELLED' | null;
  holderType: 'MAIN' | 'ADDITIONAL' | null;
}

export interface AccountRecord {
  id: string;
  type: string;
  subtype: string | null;
  number: string | null;
  name: string | null;
  marketingName: string | null;
  balance: number | null;
  itemId: string;
  taxNumber: string | null;
  owner: string | null;
  currencyCode: string | null;
  bankData: AccountBankData | null;
  creditData: AccountCreditData | null;
}

export interface AccountCreateInput {
  id: string;
  type: string;
  itemId: string;
  subtype?: string | undefined;
  number?: string | undefined;
  name?: string | undefined;
  marketingName?: string | undefined;
  balance?: number | undefined;
  taxNumber?: string | undefined;
  owner?: string | undefined;
  currencyCode?: string | undefined;
  bankData?: AccountBankData | null | undefined;
  creditData?: AccountCreditData | null | undefined;
}

export interface AccountUpdateInput {
  type?: string | undefined;
  itemId?: string | undefined;
  subtype?: string | null | undefined;
  number?: string | null | undefined;
  name?: string | null | undefined;
  marketingName?: string | null | undefined;
  balance?: number | null | undefined;
  taxNumber?: string | null | undefined;
  owner?: string | null | undefined;
  currencyCode?: string | null | undefined;
  bankData?: AccountBankData | null | undefined;
  creditData?: AccountCreditData | null | undefined;
}

export interface AccountRepository {
  create(input: AccountCreateInput): Promise<AccountRecord>;
  list(): Promise<AccountRecord[]>;
  getById(id: string): Promise<AccountRecord | null>;
  updateById(id: string, input: AccountUpdateInput): Promise<AccountRecord | null>;
  deleteById(id: string): Promise<boolean>;
}
