import { describe, expect, it, vi } from 'vitest';

import { getItemById, listItems, updateItemById } from '../items.js';
import { itemIdSchema, itemUpdateSchema } from '../items.utils.js';
import type { ItemRecord, ItemsRepository } from '../items.types.js';

const itemMock: ItemRecord = {
  id: 'e062ab2b-9006-45e8-b689-defabba53647',
  provider: 'pluggy',
  connector: { id: 1 },
  createdAt: '2024-09-19T13:10:31.212Z',
  updatedAt: '2024-09-19T13:11:23.613Z',
  status: 'UPDATED',
  executionStatus: 'SUCCESS',
  lastUpdatedAt: '2024-09-19T13:11:23.595Z',
  webhookUrl: null,
  error: null,
  clientUserId: 'gabriel@pluggy.ai',
  consecutiveFailedLoginAttempts: 0,
  statusDetail: null,
  parameter: null,
  userAction: null,
  nextAutoSyncAt: null,
  consentExpiresAt: null,
  products: ['ACCOUNTS'],
  oauthRedirectUri: null
};

describe('items module', () => {
  const repository: ItemsRepository = {
    list: vi.fn(async () => [itemMock]),
    getById: vi.fn(async (id: string) => (id === itemMock.id ? itemMock : null)),
    updateById: vi.fn(async (id: string) => (id === itemMock.id ? itemMock : null))
  };

  it('lists items', async () => {
    const result = await listItems(repository);
    expect(result).toHaveLength(1);
  });

  it('gets item by id', async () => {
    const result = await getItemById(repository, itemMock.id);
    expect(result?.id).toBe(itemMock.id);
  });

  it('validates id and update payload', () => {
    expect(() => itemIdSchema.parse('invalid-id')).toThrow();
    expect(() => itemUpdateSchema.parse({})).toThrow();
  });

  it('updates item by id', async () => {
    const result = await updateItemById(repository, itemMock.id, { status: 'UPDATED' });
    expect(result?.status).toBe('UPDATED');
  });
});
