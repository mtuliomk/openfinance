import { describe, expect, it, vi } from 'vitest';

import type { AccountRepository } from '../../account/account.types.js';
import type { ItemRecord, ItemsRepository } from '../../items/items.types.js';
import type { InvestmentRepository } from '../../investment/investment.types.js';
import type { ConsentRepository } from '../../consent/consent.types.js';
import type { IdentityRepository } from '../../identity/identity.types.js';
import type { LoanRepository } from '../../loan/loan.types.js';
import type { BillRepository } from '../../bill/bill.types.js';
import type { TransactionRepository } from '../../transaction/transaction.types.js';
import { reloadOpenFinance } from '../openfinance-reload.js';
import type { PluggyClientLike, ReloadLogger } from '../openfinance-reload.types.js';

describe('openfinance reload', () => {
  it('lists accounts from all items and persists them', async () => {
    const items: ItemRecord[] = [
      {
        id: 'item-1',
        provider: 'pluggy',
        connector: null,
        createdAt: '',
        updatedAt: '',
        status: '',
        executionStatus: '',
        lastUpdatedAt: null,
        webhookUrl: null,
        error: null,
        clientUserId: 'user-1',
        consecutiveFailedLoginAttempts: 0,
        statusDetail: null,
        parameter: null,
        userAction: null,
        nextAutoSyncAt: null,
        consentExpiresAt: null,
        products: [],
        oauthRedirectUri: null
      }
    ];

    const itemsRepository: ItemsRepository = {
      list: vi.fn(async () => items),
      getById: vi.fn(),
      updateById: vi.fn(async () => items[0] ?? null)
    };
    const accountRepository: AccountRepository = {
      create: vi.fn(async (input) => ({ ...input, subtype: null, number: null, name: null, marketingName: null, balance: null, taxNumber: null, owner: null, currencyCode: null, bankData: null, creditData: null })),
      list: vi.fn(),
      getById: vi.fn(),
      updateById: vi.fn(async () => null),
      deleteById: vi.fn()
    };
    const pluggyClient: PluggyClientLike = {
      fetchItem: vi.fn(async () => ({
        provider: 'pluggy',
        status: 'UPDATED',
        executionStatus: 'SUCCESS',
        products: ['ACCOUNTS']
      })),
      fetchAccounts: vi.fn(async () => ({
        results: [
          {
            id: 'acc-1',
            type: 'CHECKING',
            itemId: 'item-1',
            bankData: {
              transferNumber: '001',
              closingBalance: 100,
              automaticallyInvestedBalance: 0,
              overdraftUsedLimit: 10,
              unarrangedOverdraftAmount: 0
            },
            creditData: {
              level: 'GOLD',
              brand: 'VISA',
              balanceCloseDate: new Date('2026-05-01T00:00:00.000Z'),
              balanceDueDate: new Date('2026-05-10T00:00:00.000Z'),
              availableCreditLimit: 1000,
              balanceForeignCurrency: 0,
              minimumPayment: 50,
              creditLimit: 2000,
              isLimitFlexible: false,
              status: 'ACTIVE',
              holderType: 'MAIN'
            }
          }
        ]
      })),
      fetchTransactions: vi.fn(async () => ({
        results: [
          {
            id: 'txn-1',
            accountId: 'acc-1',
            date: new Date('2026-05-20T00:00:00.000Z'),
            description: 'Pagamento',
            type: 'DEBIT',
            amount: 10,
            balance: 90,
            currencyCode: 'BRL',
            categoryId: null,
            operationType: null,
            providerId: null,
            createdAt: new Date('2026-05-20T00:00:00.000Z'),
            updatedAt: new Date('2026-05-20T00:00:00.000Z')
          }
        ]
      })),
      fetchInvestments: vi.fn(async () => ({
        results: [
          {
            id: 'inv-1',
            itemId: 'item-1',
            type: 'FIXED_INCOME',
            name: 'CDB XPTO',
            currencyCode: 'BRL',
            balance: 1000
          }
        ]
      })),
      fetchConsents: vi.fn(async () => ({
        results: [
          {
            id: 'consent-1',
            itemId: 'item-1',
            products: ['ACCOUNTS'],
            openFinancePermissionsGranted: ['ACCOUNTS_READ'],
            createdAt: new Date('2026-05-20T00:00:00.000Z'),
            expiresAt: null,
            revokedAt: null
          }
        ]
      })),
      fetchIdentityByItemId: vi.fn(async () => ({
        id: 'identity-1',
        itemId: 'item-1',
        fullName: 'John Doe',
        createdAt: new Date('2026-05-20T00:00:00.000Z'),
        updatedAt: new Date('2026-05-20T00:00:00.000Z')
      })),
      fetchLoans: vi.fn(async () => ({
        results: [
          {
            id: 'loan-1',
            itemId: 'item-1',
            productName: 'Emprestimo',
            currencyCode: 'BRL'
          }
        ]
      })),
      fetchCreditCardBills: vi.fn(async () => ({
        results: [
          {
            id: 'bill-1',
            dueDate: new Date('2026-05-20T00:00:00.000Z'),
            totalAmount: 100,
            totalAmountCurrencyCode: 'BRL',
            minimumPaymentAmount: 20,
            allowsInstallments: true,
            financeCharges: [],
            createdAt: new Date('2026-05-20T00:00:00.000Z'),
            updatedAt: new Date('2026-05-20T00:00:00.000Z')
          }
        ]
      }))
    };
    const transactionRepository: TransactionRepository = {
      create: vi.fn(async (input) => ({
        ...input,
        status: input.status ?? null,
        providerCode: input.providerCode ?? null
      })),
      list: vi.fn(),
      getById: vi.fn(),
      updateById: vi.fn(async () => null),
      deleteById: vi.fn()
    };
    const logger: ReloadLogger = { info: vi.fn() };
    const investmentRepository: InvestmentRepository = {
      create: vi.fn(async (input) => ({
        ...input,
        createdAt: input.createdAt ?? new Date().toISOString(),
        updatedAt: input.updatedAt ?? new Date().toISOString()
      })),
      list: vi.fn(),
      getById: vi.fn(),
      updateById: vi.fn(async () => null),
      deleteById: vi.fn()
    };
    const consentRepository: ConsentRepository = {
      create: vi.fn(async (input) => input),
      list: vi.fn(),
      getById: vi.fn(),
      updateById: vi.fn(async () => null),
      deleteById: vi.fn()
    };
    const identityRepository: IdentityRepository = {
      create: vi.fn(async (input) => input),
      list: vi.fn(),
      getById: vi.fn(),
      updateById: vi.fn(async () => null),
      deleteById: vi.fn()
    };
    const loanRepository: LoanRepository = {
      create: vi.fn(async (input) => input),
      list: vi.fn(),
      getById: vi.fn(),
      updateById: vi.fn(async () => null),
      deleteById: vi.fn()
    };
    const billRepository: BillRepository = {
      create: vi.fn(async (input) => input),
      list: vi.fn(),
      getById: vi.fn(),
      updateById: vi.fn(async () => null),
      deleteById: vi.fn()
    };

    const result = await reloadOpenFinance({
      itemsRepository,
      accountRepository,
      transactionRepository,
      investmentRepository,
      consentRepository,
      identityRepository,
      loanRepository,
      billRepository,
      pluggyClient,
      logger
    });

    expect(result.totalItems).toBe(1);
    expect(result.totalAccountsFound).toBe(1);
    expect(result.totalAccountsSaved).toBe(1);
    expect(result.totalInvestmentsFound).toBe(1);
    expect(result.totalInvestmentsSaved).toBe(1);
    expect(result.totalConsentsFound).toBe(1);
    expect(result.totalConsentsSaved).toBe(1);
    expect(result.totalIdentitiesFound).toBe(1);
    expect(result.totalIdentitiesSaved).toBe(1);
    expect(result.totalLoansFound).toBe(1);
    expect(result.totalLoansSaved).toBe(1);
    expect(result.totalBillsFound).toBe(1);
    expect(result.totalBillsSaved).toBe(1);
    expect(itemsRepository.updateById).toHaveBeenCalledTimes(1);
    expect(itemsRepository.updateById).toHaveBeenCalledWith(
      'item-1',
      expect.objectContaining({
        status: 'UPDATED',
        executionStatus: 'SUCCESS'
      })
    );
    expect(accountRepository.create).toHaveBeenCalledTimes(1);
    expect(transactionRepository.create).toHaveBeenCalledTimes(1);
    expect(investmentRepository.create).toHaveBeenCalledTimes(1);
    expect(consentRepository.create).toHaveBeenCalledTimes(1);
    expect(identityRepository.create).toHaveBeenCalledTimes(1);
    expect(loanRepository.create).toHaveBeenCalledTimes(1);
    expect(billRepository.create).toHaveBeenCalledTimes(1);
    expect(accountRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        bankData: expect.objectContaining({
          transferNumber: '001',
          closingBalance: 100
        }),
        creditData: expect.objectContaining({
          brand: 'VISA',
          status: 'ACTIVE'
        })
      })
    );
    expect(logger.info).toHaveBeenCalledTimes(8);
  });
});
