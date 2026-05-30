import { describe, expect, it, vi } from 'vitest';

import {
  createConsent,
  deleteConsentById,
  getConsentById,
  listConsent,
  updateConsentById
} from '../consent.js';
import { consentCreateSchema, consentIdSchema, consentUpdateSchema } from '../consent.utils.js';
import type { ConsentCreateInput, ConsentRecord, ConsentRepository } from '../consent.types.js';

const consentMock: ConsentRecord = {
  id: 'consent-1',
  itemId: 'a0922d6f-2007-4169-a181-b961500608db',
  products: ['ACCOUNTS'],
  openFinancePermissionsGranted: ['ACCOUNTS_READ'],
  createdAt: '2026-05-30T10:00:00.000Z',
  expiresAt: null,
  revokedAt: null
};

const createInputMock: ConsentCreateInput = { ...consentMock };

describe('consent module', () => {
  const repository: ConsentRepository = {
    create: vi.fn(async () => consentMock),
    list: vi.fn(async () => [consentMock]),
    getById: vi.fn(async (id: string) => (id === consentMock.id ? consentMock : null)),
    updateById: vi.fn(async (id: string) => (id === consentMock.id ? consentMock : null)),
    deleteById: vi.fn(async (id: string) => id === consentMock.id)
  };

  it('creates consent', async () => {
    const result = await createConsent(repository, createInputMock);
    expect(result.id).toBe(consentMock.id);
  });

  it('lists consent', async () => {
    const result = await listConsent(repository);
    expect(result).toHaveLength(1);
  });

  it('gets consent by id', async () => {
    const result = await getConsentById(repository, consentMock.id);
    expect(result?.id).toBe(consentMock.id);
  });

  it('updates consent by id', async () => {
    const result = await updateConsentById(repository, consentMock.id, { products: ['ACCOUNTS', 'TRANSACTIONS'] });
    expect(result?.id).toBe(consentMock.id);
  });

  it('deletes consent by id', async () => {
    const deleted = await deleteConsentById(repository, consentMock.id);
    expect(deleted).toBe(true);
  });

  it('validates create and update payloads', () => {
    expect(() => consentIdSchema.parse('')).toThrow();
    expect(() => consentCreateSchema.parse({})).toThrow();
    expect(() => consentUpdateSchema.parse({})).toThrow();
  });
});
