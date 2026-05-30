import type { ItemRecord, ItemUpdateInput, ItemsRepository } from './items.types.js';

export async function listItems(repository: ItemsRepository): Promise<ItemRecord[]> {
  return repository.list();
}

export async function getItemById(
  repository: ItemsRepository,
  id: string
): Promise<ItemRecord | null> {
  return repository.getById(id);
}

export async function updateItemById(
  repository: ItemsRepository,
  id: string,
  input: ItemUpdateInput
): Promise<ItemRecord | null> {
  return repository.updateById(id, input);
}
