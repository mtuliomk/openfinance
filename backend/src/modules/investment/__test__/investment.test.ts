import { describe, expect, it, vi } from 'vitest';

import {
  createInvestment,
  deleteInvestmentById,
  getInvestmentById,
  listInvestment,
  updateInvestmentById
} from '../investment.js';
import {
  investmentCreateSchema,
  investmentIdSchema,
  investmentUpdateSchema
} from '../investment.utils.js';
import type {
  InvestmentCreateInput,
  InvestmentRecord,
  InvestmentRepository
} from '../investment.types.js';

const investmentMock: InvestmentRecord = {
  id: 'inv-1',
  itemId: 'a0922d6f-2007-4169-a181-b961500608db',
  code: '12345678000100',
  issuerCnpj: null,
  number: '001',
  isin: null,
  type: 'FIXED_INCOME',
  subtype: 'CDB',
  status: 'ACTIVE',
  name: 'CDB XPTO',
  currencyCode: 'BRL',
  date: '2026-05-30T10:00:00.000Z',
  dueDate: null,
  issueDate: null,
  purchaseDate: null,
  value: 100,
  quantity: 10,
  taxes: null,
  taxes2: null,
  balance: 1000,
  amount: 1000,
  amountWithdrawal: null,
  amountProfit: 50,
  amountOriginal: 950,
  issuer: 'Banco X',
  rate: 100,
  rateType: 'CDI',
  fixedAnnualRate: null,
  lastMonthRate: null,
  annualRate: null,
  lastTwelveMonthsRate: null,
  owner: 'John Doe',
  metadata: null,
  institution: null,
  createdAt: '2026-05-30T10:00:00.000Z',
  updatedAt: '2026-05-30T10:00:00.000Z'
};

const createInputMock: InvestmentCreateInput = { ...investmentMock };

describe('investment module', () => {
  const repository: InvestmentRepository = {
    create: vi.fn(async () => investmentMock),
    list: vi.fn(async () => [investmentMock]),
    getById: vi.fn(async (id: string) => (id === investmentMock.id ? investmentMock : null)),
    updateById: vi.fn(async (id: string) => (id === investmentMock.id ? investmentMock : null)),
    deleteById: vi.fn(async (id: string) => id === investmentMock.id)
  };

  it('creates investment', async () => {
    const result = await createInvestment(repository, createInputMock);
    expect(result.id).toBe(investmentMock.id);
  });

  it('lists investment', async () => {
    const result = await listInvestment(repository);
    expect(result).toHaveLength(1);
  });

  it('gets investment by id', async () => {
    const result = await getInvestmentById(repository, investmentMock.id);
    expect(result?.id).toBe(investmentMock.id);
  });

  it('updates investment by id', async () => {
    const result = await updateInvestmentById(repository, investmentMock.id, { name: 'Novo investimento' });
    expect(result?.id).toBe(investmentMock.id);
  });

  it('deletes investment by id', async () => {
    const deleted = await deleteInvestmentById(repository, investmentMock.id);
    expect(deleted).toBe(true);
  });

  it('validates create and update payloads', () => {
    expect(() => investmentIdSchema.parse('')).toThrow();
    expect(() => investmentCreateSchema.parse({})).toThrow();
    expect(() => investmentUpdateSchema.parse({})).toThrow();
  });
});
