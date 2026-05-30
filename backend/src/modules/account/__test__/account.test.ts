import { describe, expect, it, vi } from 'vitest';

import {
  createAccount,
  deleteAccountById,
  getAccountById,
  listAccount,
  updateAccountById
} from '../account.js';
import { accountCreateSchema, accountIdSchema, accountUpdateSchema } from '../account.utils.js';
import type { AccountCreateInput, AccountRecord, AccountRepository } from '../account.types.js';

const accountMock: AccountRecord = {
  id: 'a658c848-e475-457b-8565-d1fffba127c4',
  type: 'BANK',
  subtype: 'CHECKING_ACCOUNT',
  number: '0001/12345-0',
  name: 'Conta Corrente',
  marketingName: 'GOLD Conta Corrente',
  balance: 120950,
  itemId: 'a0922d6f-2007-4169-a181-b961500608db',
  taxNumber: '416.799.495-00',
  owner: 'John Doe',
  currencyCode: 'BRL',
  bankData: {
    transferNumber: '0001/12345-0',
    closingBalance: 120950,
    automaticallyInvestedBalance: null,
    overdraftUsedLimit: 0,
    unarrangedOverdraftAmount: 0
  },
  creditData: null
};

const createInputMock: AccountCreateInput = {
  id: 'a658c848-e475-457b-8565-d1fffba127c4',
  type: 'BANK',
  itemId: 'a0922d6f-2007-4169-a181-b961500608db',
  subtype: 'CHECKING_ACCOUNT',
  number: '0001/12345-0',
  name: 'Conta Corrente',
  marketingName: 'GOLD Conta Corrente',
  balance: 120950,
  taxNumber: '416.799.495-00',
  owner: 'John Doe',
  currencyCode: 'BRL',
  bankData: {
    transferNumber: '0001/12345-0',
    closingBalance: 120950,
    automaticallyInvestedBalance: null,
    overdraftUsedLimit: 0,
    unarrangedOverdraftAmount: 0
  },
  creditData: null
};

describe('account module', () => {
  const repository: AccountRepository = {
    create: vi.fn(async () => accountMock),
    list: vi.fn(async () => [accountMock]),
    getById: vi.fn(async (id: string) => (id === accountMock.id ? accountMock : null)),
    updateById: vi.fn(async (id: string) => (id === accountMock.id ? accountMock : null)),
    deleteById: vi.fn(async (id: string) => id === accountMock.id)
  };

  it('creates account', async () => {
    const result = await createAccount(repository, createInputMock);
    expect(result.id).toBe(accountMock.id);
  });

  it('lists account', async () => {
    const result = await listAccount(repository);
    expect(result).toHaveLength(1);
  });

  it('gets account by id', async () => {
    const result = await getAccountById(repository, accountMock.id);
    expect(result?.id).toBe(accountMock.id);
  });

  it('updates account by id', async () => {
    const result = await updateAccountById(repository, accountMock.id, { name: 'Nova Conta' });
    expect(result?.id).toBe(accountMock.id);
  });

  it('deletes account by id', async () => {
    const deleted = await deleteAccountById(repository, accountMock.id);
    expect(deleted).toBe(true);
  });

  it('validates create and update payloads', () => {
    expect(() => accountIdSchema.parse('invalid')).toThrow();
    expect(() => accountCreateSchema.parse({})).toThrow();
    expect(() => accountUpdateSchema.parse({})).toThrow();
  });
});
