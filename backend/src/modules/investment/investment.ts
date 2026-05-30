import type {
  InvestmentCreateInput,
  InvestmentRecord,
  InvestmentRepository,
  InvestmentUpdateInput
} from './investment.types.js';

export async function createInvestment(
  repository: InvestmentRepository,
  input: InvestmentCreateInput
): Promise<InvestmentRecord> {
  return repository.create(input);
}

export async function listInvestment(repository: InvestmentRepository): Promise<InvestmentRecord[]> {
  return repository.list();
}

export async function getInvestmentById(
  repository: InvestmentRepository,
  id: string
): Promise<InvestmentRecord | null> {
  return repository.getById(id);
}

export async function updateInvestmentById(
  repository: InvestmentRepository,
  id: string,
  input: InvestmentUpdateInput
): Promise<InvestmentRecord | null> {
  return repository.updateById(id, input);
}

export async function deleteInvestmentById(
  repository: InvestmentRepository,
  id: string
): Promise<boolean> {
  return repository.deleteById(id);
}
