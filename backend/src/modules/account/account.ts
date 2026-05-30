import type {
  AccountCreateInput,
  AccountRecord,
  AccountRepository,
  AccountUpdateInput
} from './account.types.js';

export async function createAccount(
  repository: AccountRepository,
  input: AccountCreateInput
): Promise<AccountRecord> {
  return repository.create(input);
}

export async function listAccount(repository: AccountRepository): Promise<AccountRecord[]> {
  return repository.list();
}

export async function getAccountById(
  repository: AccountRepository,
  id: string
): Promise<AccountRecord | null> {
  return repository.getById(id);
}

export async function updateAccountById(
  repository: AccountRepository,
  id: string,
  input: AccountUpdateInput
): Promise<AccountRecord | null> {
  return repository.updateById(id, input);
}

export async function deleteAccountById(repository: AccountRepository, id: string): Promise<boolean> {
  return repository.deleteById(id);
}
