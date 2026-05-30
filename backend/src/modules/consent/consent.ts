import type {
  ConsentCreateInput,
  ConsentRecord,
  ConsentRepository,
  ConsentUpdateInput
} from './consent.types.js';

export async function createConsent(
  repository: ConsentRepository,
  input: ConsentCreateInput
): Promise<ConsentRecord> {
  return repository.create(input);
}

export async function listConsent(repository: ConsentRepository): Promise<ConsentRecord[]> {
  return repository.list();
}

export async function getConsentById(
  repository: ConsentRepository,
  id: string
): Promise<ConsentRecord | null> {
  return repository.getById(id);
}

export async function updateConsentById(
  repository: ConsentRepository,
  id: string,
  input: ConsentUpdateInput
): Promise<ConsentRecord | null> {
  return repository.updateById(id, input);
}

export async function deleteConsentById(repository: ConsentRepository, id: string): Promise<boolean> {
  return repository.deleteById(id);
}
