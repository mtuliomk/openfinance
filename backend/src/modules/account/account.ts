import type {
  AccountCreateInput,
  AccountRecord,
  AccountRepository,
  AccountUpdateInput
} from './account.types.js';

function withAdjustedBalance(account: AccountRecord): AccountRecord {
  if (account.balance === null) {
    return account;
  }

  return {
    ...account,
    balance: account.balance - account.initialBalance
  };
}

export async function createAccount(
  repository: AccountRepository,
  input: AccountCreateInput
): Promise<AccountRecord> {
  const created = await repository.create(input);
  return withAdjustedBalance(created);
}

export async function listAccount(repository: AccountRepository): Promise<AccountRecord[]> {
  const accounts = await repository.list();
  return accounts.map(withAdjustedBalance);
}

export async function getAccountById(
  repository: AccountRepository,
  id: string
): Promise<AccountRecord | null> {
  const account = await repository.getById(id);
  return account ? withAdjustedBalance(account) : null;
}

export async function updateAccountById(
  repository: AccountRepository,
  id: string,
  input: AccountUpdateInput
): Promise<AccountRecord | null> {
  const updated = await repository.updateById(id, input);
  return updated ? withAdjustedBalance(updated) : null;
}

export async function deleteAccountById(repository: AccountRepository, id: string): Promise<boolean> {
  return repository.deleteById(id);
}
