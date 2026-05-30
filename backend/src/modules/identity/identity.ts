import type {
  IdentityCreateInput,
  IdentityRecord,
  IdentityRepository,
  IdentityUpdateInput
} from './identity.types.js';

export async function createIdentity(
  repository: IdentityRepository,
  input: IdentityCreateInput
): Promise<IdentityRecord> {
  return repository.create(input);
}

export async function listIdentity(repository: IdentityRepository): Promise<IdentityRecord[]> {
  return repository.list();
}

export async function getIdentityById(
  repository: IdentityRepository,
  id: string
): Promise<IdentityRecord | null> {
  return repository.getById(id);
}

export async function updateIdentityById(
  repository: IdentityRepository,
  id: string,
  input: IdentityUpdateInput
): Promise<IdentityRecord | null> {
  return repository.updateById(id, input);
}

export async function deleteIdentityById(repository: IdentityRepository, id: string): Promise<boolean> {
  return repository.deleteById(id);
}
