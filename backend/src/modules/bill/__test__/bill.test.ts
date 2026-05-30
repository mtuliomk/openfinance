import { describe, expect, it, vi } from 'vitest';

import { createBill, deleteBillById, getBillById, listBill, updateBillById } from '../bill.js';
import { billCreateSchema, billIdSchema, billUpdateSchema } from '../bill.utils.js';
import type { BillCreateInput, BillRecord, BillRepository } from '../bill.types.js';

const billMock: BillRecord = {
  id: 'bill-1',
  accountId: 'a658c848-e475-457b-8565-d1fffba127c4',
  dueDate: '2026-05-30T10:00:00.000Z',
  totalAmount: 1000,
  totalAmountCurrencyCode: 'BRL',
  minimumPaymentAmount: 100,
  allowsInstallments: true,
  financeCharges: [],
  createdAt: '2026-05-30T10:00:00.000Z',
  updatedAt: '2026-05-30T10:00:00.000Z'
};

const createInputMock: BillCreateInput = { ...billMock };

describe('bill module', () => {
  const repository: BillRepository = {
    create: vi.fn(async () => billMock),
    list: vi.fn(async () => [billMock]),
    getById: vi.fn(async (id: string) => (id === billMock.id ? billMock : null)),
    updateById: vi.fn(async (id: string) => (id === billMock.id ? billMock : null)),
    deleteById: vi.fn(async (id: string) => id === billMock.id)
  };

  it('creates bill', async () => {
    const result = await createBill(repository, createInputMock);
    expect(result.id).toBe(billMock.id);
  });

  it('lists bill', async () => {
    const result = await listBill(repository);
    expect(result).toHaveLength(1);
  });

  it('gets bill by id', async () => {
    const result = await getBillById(repository, billMock.id);
    expect(result?.id).toBe(billMock.id);
  });

  it('updates bill by id', async () => {
    const result = await updateBillById(repository, billMock.id, { totalAmount: 1200 });
    expect(result?.id).toBe(billMock.id);
  });

  it('deletes bill by id', async () => {
    const deleted = await deleteBillById(repository, billMock.id);
    expect(deleted).toBe(true);
  });

  it('validates create and update payloads', () => {
    expect(() => billIdSchema.parse('')).toThrow();
    expect(() => billCreateSchema.parse({})).toThrow();
    expect(() => billUpdateSchema.parse({})).toThrow();
  });
});
