import type {
  TransactionCreateInput,
  TransactionRecord,
  TransactionRepository,
  TransactionUpdateInput
} from './transaction.types.js';

export async function createTransaction(
  repository: TransactionRepository,
  input: TransactionCreateInput
): Promise<TransactionRecord> {
  return repository.create(input);
}

export async function listTransaction(repository: TransactionRepository): Promise<TransactionRecord[]> {
  return repository.list();
}

export async function getTransactionById(
  repository: TransactionRepository,
  id: string
): Promise<TransactionRecord | null> {
  return repository.getById(id);
}

export async function updateTransactionById(
  repository: TransactionRepository,
  id: string,
  input: TransactionUpdateInput
): Promise<TransactionRecord | null> {
  return repository.updateById(id, input);
}

export async function deleteTransactionById(
  repository: TransactionRepository,
  id: string
): Promise<boolean> {
  return repository.deleteById(id);
}
