import { describe, expect, it, vi } from 'vitest';

import {
  createTransaction,
  deleteTransactionById,
  getTransactionById,
  listTransaction,
  updateTransactionById
} from '../transaction.js';
import {
  transactionCreateSchema,
  transactionIdSchema,
  transactionUpdateSchema
} from '../transaction.utils.js';
import type {
  TransactionCreateInput,
  TransactionRecord,
  TransactionRepository
} from '../transaction.types.js';

const transactionMock: TransactionRecord = {
  id: 'txn-1',
  accountId: 'a658c848-e475-457b-8565-d1fffba127c4',
  date: '2026-05-30T10:00:00.000Z',
  description: 'PIX recebido',
  descriptionRaw: 'PIX RECEBIDO',
  type: 'CREDIT',
  amount: 120.5,
  amountInAccountCurrency: 120.5,
  balance: 1000.25,
  currencyCode: 'BRL',
  category: 'transfer',
  status: 'POSTED',
  providerCode: '01',
  paymentData: null,
  creditCardMetadata: null,
  merchant: null,
  categoryId: null,
  operationType: null,
  providerId: null,
  createdAt: '2026-05-30T10:00:00.000Z',
  updatedAt: '2026-05-30T10:00:00.000Z'
};

const createInputMock: TransactionCreateInput = { ...transactionMock };

describe('transaction module', () => {
  const repository: TransactionRepository = {
    create: vi.fn(async () => transactionMock),
    list: vi.fn(async () => [transactionMock]),
    getById: vi.fn(async (id: string) => (id === transactionMock.id ? transactionMock : null)),
    updateById: vi.fn(async (id: string) => (id === transactionMock.id ? transactionMock : null)),
    deleteById: vi.fn(async (id: string) => id === transactionMock.id)
  };

  it('creates transaction', async () => {
    const result = await createTransaction(repository, createInputMock);
    expect(result.id).toBe(transactionMock.id);
  });

  it('lists transaction', async () => {
    const result = await listTransaction(repository);
    expect(result).toHaveLength(1);
  });

  it('gets transaction by id', async () => {
    const result = await getTransactionById(repository, transactionMock.id);
    expect(result?.id).toBe(transactionMock.id);
  });

  it('updates transaction by id', async () => {
    const result = await updateTransactionById(repository, transactionMock.id, {
      description: 'PIX recebido ajuste'
    });
    expect(result?.id).toBe(transactionMock.id);
  });

  it('deletes transaction by id', async () => {
    const deleted = await deleteTransactionById(repository, transactionMock.id);
    expect(deleted).toBe(true);
  });

  it('validates create and update payloads', () => {
    expect(() => transactionIdSchema.parse('')).toThrow();
    expect(() => transactionCreateSchema.parse({})).toThrow();
    expect(() => transactionUpdateSchema.parse({})).toThrow();
  });
});
