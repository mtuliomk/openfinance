import { eq } from 'drizzle-orm';

import type { BillCreateInput, BillRecord, BillRepository, BillUpdateInput } from '../../../../modules/bill/bill.types.js';
import { db } from '../drizzle-db.js';
import { billTable } from '../schema/bill.js';

export const billRepository: BillRepository = {
  async create(input: BillCreateInput): Promise<BillRecord> {
    await db.insert(billTable).values(input);
    const [created] = await db.select().from(billTable).where(eq(billTable.id, input.id));

    if (!created) {
      throw new Error('Failed to create bill');
    }

    return created;
  },

  async list(): Promise<BillRecord[]> {
    return db.select().from(billTable);
  },

  async getById(id: string): Promise<BillRecord | null> {
    const [bill] = await db.select().from(billTable).where(eq(billTable.id, id));
    return bill ?? null;
  },

  async updateById(id: string, input: BillUpdateInput): Promise<BillRecord | null> {
    await db.update(billTable).set(input).where(eq(billTable.id, id));
    const [updated] = await db.select().from(billTable).where(eq(billTable.id, id));
    return updated ?? null;
  },

  async deleteById(id: string): Promise<boolean> {
    const result = await db.delete(billTable).where(eq(billTable.id, id));
    return Number(result.rowsAffected ?? 0) > 0;
  }
};
