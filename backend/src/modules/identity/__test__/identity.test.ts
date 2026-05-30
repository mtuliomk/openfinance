import { describe, expect, it, vi } from 'vitest';

import {
  createIdentity,
  deleteIdentityById,
  getIdentityById,
  listIdentity,
  updateIdentityById
} from '../identity.js';
import { identityCreateSchema, identityIdSchema, identityUpdateSchema } from '../identity.utils.js';
import type { IdentityCreateInput, IdentityRecord, IdentityRepository } from '../identity.types.js';

const identityMock: IdentityRecord = {
  id: 'identity-1',
  itemId: 'a0922d6f-2007-4169-a181-b961500608db',
  birthDate: null,
  taxNumber: null,
  document: null,
  documentType: null,
  jobTitle: null,
  companyName: null,
  fullName: 'John Doe',
  phoneNumbers: null,
  emails: null,
  addresses: null,
  relations: null,
  investorProfile: null,
  establishmentName: null,
  establishmentCode: null,
  financialRelationships: null,
  qualifications: null,
  socialName: null,
  sex: null,
  maritalStatus: null,
  nationality: null,
  otherDocuments: null,
  passport: null,
  incorporationDate: null,
  parties: null,
  businessOtherDocuments: null,
  companiesCnpj: null,
  createdAt: '2026-05-30T10:00:00.000Z',
  updatedAt: '2026-05-30T10:00:00.000Z'
};

const createInputMock: IdentityCreateInput = { ...identityMock };

describe('identity module', () => {
  const repository: IdentityRepository = {
    create: vi.fn(async () => identityMock),
    list: vi.fn(async () => [identityMock]),
    getById: vi.fn(async (id: string) => (id === identityMock.id ? identityMock : null)),
    updateById: vi.fn(async (id: string) => (id === identityMock.id ? identityMock : null)),
    deleteById: vi.fn(async (id: string) => id === identityMock.id)
  };

  it('creates identity', async () => {
    const result = await createIdentity(repository, createInputMock);
    expect(result.id).toBe(identityMock.id);
  });

  it('lists identity', async () => {
    const result = await listIdentity(repository);
    expect(result).toHaveLength(1);
  });

  it('gets identity by id', async () => {
    const result = await getIdentityById(repository, identityMock.id);
    expect(result?.id).toBe(identityMock.id);
  });

  it('updates identity by id', async () => {
    const result = await updateIdentityById(repository, identityMock.id, { fullName: 'Jane Doe' });
    expect(result?.id).toBe(identityMock.id);
  });

  it('deletes identity by id', async () => {
    const deleted = await deleteIdentityById(repository, identityMock.id);
    expect(deleted).toBe(true);
  });

  it('validates create and update payloads', () => {
    expect(() => identityIdSchema.parse('')).toThrow();
    expect(() => identityCreateSchema.parse({})).toThrow();
    expect(() => identityUpdateSchema.parse({})).toThrow();
  });
});
