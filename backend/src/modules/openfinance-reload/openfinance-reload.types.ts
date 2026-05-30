import type { AccountCreateInput, AccountRepository } from '../account/account.types.js';
import type { ItemRecord, ItemsRepository, ItemUpdateInput } from '../items/items.types.js';
import type {
  TransactionCreateInput,
  TransactionRepository
} from '../transaction/transaction.types.js';
import type { InvestmentCreateInput, InvestmentRepository } from '../investment/investment.types.js';
import type { ConsentCreateInput, ConsentRepository } from '../consent/consent.types.js';
import type { IdentityCreateInput, IdentityRepository } from '../identity/identity.types.js';
import type { LoanCreateInput, LoanRepository } from '../loan/loan.types.js';
import type { BillCreateInput, BillRepository } from '../bill/bill.types.js';

export interface PluggyAccount {
  id: string;
  type: string;
  itemId: string;
  subtype?: string | null | undefined;
  number?: string | null | undefined;
  name?: string | null | undefined;
  marketingName?: string | null | undefined;
  balance?: number | null | undefined;
  taxNumber?: string | null | undefined;
  owner?: string | null | undefined;
  currencyCode?: string | null | undefined;
  bankData?: AccountCreateInput['bankData'] | undefined;
  creditData?: AccountCreateInput['creditData'] | undefined;
}

export interface PluggyClientLike {
  fetchItem(itemId: string): Promise<unknown>;
  fetchAccounts(itemId: string): Promise<{ results?: unknown[] }>;
  fetchTransactions(
    accountId: string,
    options: { from: string; to: string }
  ): Promise<{ results?: unknown[] }>;
  fetchInvestments(itemId: string): Promise<{ results?: unknown[] }>;
  fetchConsents(itemId: string): Promise<{ results?: unknown[] }>;
  fetchIdentityByItemId(itemId: string): Promise<unknown>;
  fetchLoans(itemId: string): Promise<{ results?: unknown[] }>;
  fetchCreditCardBills(accountId: string): Promise<{ results?: unknown[] }>;
}

export type PluggyItemPayload = ItemUpdateInput;

export interface ReloadLogger {
  info(message: string, context: Record<string, unknown>): void;
}

export interface ReloadDependencies {
  itemsRepository: ItemsRepository;
  accountRepository: AccountRepository;
  transactionRepository: TransactionRepository;
  investmentRepository: InvestmentRepository;
  consentRepository: ConsentRepository;
  identityRepository: IdentityRepository;
  loanRepository: LoanRepository;
  billRepository: BillRepository;
  pluggyClient: PluggyClientLike;
  logger: ReloadLogger;
}

export type PluggyTransaction = TransactionCreateInput;
export type PluggyInvestment = InvestmentCreateInput;
export type PluggyConsent = ConsentCreateInput;
export type PluggyIdentity = IdentityCreateInput;
export type PluggyLoan = LoanCreateInput;
export type PluggyBill = BillCreateInput;

export interface ReloadResultItem {
  itemId: ItemRecord['id'];
  accountsFound: number;
  accountsSaved: number;
  investmentsFound: number;
  investmentsSaved: number;
  consentsFound: number;
  consentsSaved: number;
  identitiesFound: number;
  identitiesSaved: number;
  loansFound: number;
  loansSaved: number;
  billsFound: number;
  billsSaved: number;
}

export interface ReloadResult {
  totalItems: number;
  totalAccountsFound: number;
  totalAccountsSaved: number;
  totalInvestmentsFound: number;
  totalInvestmentsSaved: number;
  totalConsentsFound: number;
  totalConsentsSaved: number;
  totalIdentitiesFound: number;
  totalIdentitiesSaved: number;
  totalLoansFound: number;
  totalLoansSaved: number;
  totalBillsFound: number;
  totalBillsSaved: number;
  items: ReloadResultItem[];
}
