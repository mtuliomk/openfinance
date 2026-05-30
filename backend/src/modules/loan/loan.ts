import type { LoanCreateInput, LoanRecord, LoanRepository, LoanUpdateInput } from './loan.types.js';

export async function createLoan(repository: LoanRepository, input: LoanCreateInput): Promise<LoanRecord> {
  return repository.create(input);
}

export async function listLoan(repository: LoanRepository): Promise<LoanRecord[]> {
  return repository.list();
}

export async function getLoanById(repository: LoanRepository, id: string): Promise<LoanRecord | null> {
  return repository.getById(id);
}

export async function updateLoanById(
  repository: LoanRepository,
  id: string,
  input: LoanUpdateInput
): Promise<LoanRecord | null> {
  return repository.updateById(id, input);
}

export async function deleteLoanById(repository: LoanRepository, id: string): Promise<boolean> {
  return repository.deleteById(id);
}
