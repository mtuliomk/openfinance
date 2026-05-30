import { eq } from 'drizzle-orm';

import type {
  ConsentCreateInput,
  ConsentRecord,
  ConsentRepository,
  ConsentUpdateInput
} from '../../../../modules/consent/consent.types.js';
import { db } from '../drizzle-db.js';
import { consentTable } from '../schema/consent.js';

export const consentRepository: ConsentRepository = {
  async create(input: ConsentCreateInput): Promise<ConsentRecord> {
    await db.insert(consentTable).values(input);
    const [created] = await db.select().from(consentTable).where(eq(consentTable.id, input.id));

    if (!created) {
      throw new Error('Failed to create consent');
    }

    return created;
  },

  async list(): Promise<ConsentRecord[]> {
    return db.select().from(consentTable);
  },

  async getById(id: string): Promise<ConsentRecord | null> {
    const [consent] = await db.select().from(consentTable).where(eq(consentTable.id, id));
    return consent ?? null;
  },

  async updateById(id: string, input: ConsentUpdateInput): Promise<ConsentRecord | null> {
    await db.update(consentTable).set(input).where(eq(consentTable.id, id));
    const [updated] = await db.select().from(consentTable).where(eq(consentTable.id, id));
    return updated ?? null;
  },

  async deleteById(id: string): Promise<boolean> {
    const result = await db.delete(consentTable).where(eq(consentTable.id, id));
    return Number(result.rowsAffected ?? 0) > 0;
  }
};
