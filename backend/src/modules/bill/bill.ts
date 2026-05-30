import type { BillCreateInput, BillRecord, BillRepository, BillUpdateInput } from './bill.types.js';

export async function createBill(repository: BillRepository, input: BillCreateInput): Promise<BillRecord> {
  return repository.create(input);
}

export async function listBill(repository: BillRepository): Promise<BillRecord[]> {
  return repository.list();
}

export async function getBillById(repository: BillRepository, id: string): Promise<BillRecord | null> {
  return repository.getById(id);
}

export async function updateBillById(
  repository: BillRepository,
  id: string,
  input: BillUpdateInput
): Promise<BillRecord | null> {
  return repository.updateById(id, input);
}

export async function deleteBillById(repository: BillRepository, id: string): Promise<boolean> {
  return repository.deleteById(id);
}
