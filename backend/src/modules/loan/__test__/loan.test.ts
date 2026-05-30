import { describe, expect, it, vi } from 'vitest';

import { createLoan, deleteLoanById, getLoanById, listLoan, updateLoanById } from '../loan.js';
import { loanCreateSchema, loanIdSchema, loanUpdateSchema } from '../loan.utils.js';
import type { LoanCreateInput, LoanRecord, LoanRepository } from '../loan.types.js';

const loanMock: LoanRecord = {
  id: 'loan-1',
  itemId: 'a0922d6f-2007-4169-a181-b961500608db',
  contractNumber: null,
  ipocCode: null,
  productName: 'Emprestimo Pessoal',
  type: null,
  date: null,
  contractDate: null,
  disbursementDates: null,
  settlementDate: null,
  contractAmount: null,
  currencyCode: 'BRL',
  dueDate: null,
  installmentPeriodicity: null,
  installmentPeriodicityAdditionalInfo: null,
  firstInstallmentDueDate: null,
  cet: null,
  amortizationScheduled: null,
  amortizationScheduledAdditionalInfo: null,
  cnpjConsignee: null,
  interestRates: null,
  contractedFees: null,
  contractedFinanceCharges: null,
  warranties: null,
  installments: null,
  payments: null
};

const createInputMock: LoanCreateInput = { ...loanMock };

describe('loan module', () => {
  const repository: LoanRepository = {
    create: vi.fn(async () => loanMock),
    list: vi.fn(async () => [loanMock]),
    getById: vi.fn(async (id: string) => (id === loanMock.id ? loanMock : null)),
    updateById: vi.fn(async (id: string) => (id === loanMock.id ? loanMock : null)),
    deleteById: vi.fn(async (id: string) => id === loanMock.id)
  };

  it('creates loan', async () => {
    const result = await createLoan(repository, createInputMock);
    expect(result.id).toBe(loanMock.id);
  });

  it('lists loan', async () => {
    const result = await listLoan(repository);
    expect(result).toHaveLength(1);
  });

  it('gets loan by id', async () => {
    const result = await getLoanById(repository, loanMock.id);
    expect(result?.id).toBe(loanMock.id);
  });

  it('updates loan by id', async () => {
    const result = await updateLoanById(repository, loanMock.id, { productName: 'Novo Emprestimo' });
    expect(result?.id).toBe(loanMock.id);
  });

  it('deletes loan by id', async () => {
    const deleted = await deleteLoanById(repository, loanMock.id);
    expect(deleted).toBe(true);
  });

  it('validates create and update payloads', () => {
    expect(() => loanIdSchema.parse('')).toThrow();
    expect(() => loanCreateSchema.parse({})).toThrow();
    expect(() => loanUpdateSchema.parse({})).toThrow();
  });
});
