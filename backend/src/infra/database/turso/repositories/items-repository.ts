import { desc, eq } from 'drizzle-orm';

import type {
  ItemRecord,
  ItemUpdateInput,
  ItemsRepository
} from '../../../../modules/items/items.types.js';
import { db } from '../drizzle-db.js';
import { itemsTable } from '../schema/items.js';

export const itemsRepository: ItemsRepository = {
  async list(): Promise<ItemRecord[]> {
    return db.select().from(itemsTable).orderBy(desc(itemsTable.createdAt));
  },

  async getById(id: string): Promise<ItemRecord | null> {
    const [item] = await db.select().from(itemsTable).where(eq(itemsTable.id, id));
    return item ?? null;
  },

  async updateById(id: string, input: ItemUpdateInput): Promise<ItemRecord | null> {
    await db
      .update(itemsTable)
      .set({
        ...input,
        updatedAt: new Date().toISOString()
      })
      .where(eq(itemsTable.id, id));

    const [updated] = await db.select().from(itemsTable).where(eq(itemsTable.id, id));
    return updated ?? null;
  }
};
