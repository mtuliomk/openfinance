import { desc, eq } from 'drizzle-orm';

import type {
  IdentityCreateInput,
  IdentityRecord,
  IdentityRepository,
  IdentityUpdateInput
} from '../../../../modules/identity/identity.types.js';
import { db } from '../drizzle-db.js';
import { identityTable } from '../schema/identity.js';

export const identityRepository: IdentityRepository = {
  async create(input: IdentityCreateInput): Promise<IdentityRecord> {
    await db.insert(identityTable).values(input);
    const [created] = await db.select().from(identityTable).where(eq(identityTable.id, input.id));

    if (!created) {
      throw new Error('Failed to create identity');
    }

    return created;
  },

  async list(): Promise<IdentityRecord[]> {
    return db.select().from(identityTable).orderBy(desc(identityTable.createdAt));
  },

  async getById(id: string): Promise<IdentityRecord | null> {
    const [identity] = await db.select().from(identityTable).where(eq(identityTable.id, id));
    return identity ?? null;
  },

  async updateById(id: string, input: IdentityUpdateInput): Promise<IdentityRecord | null> {
    await db.update(identityTable).set(input).where(eq(identityTable.id, id));
    const [updated] = await db.select().from(identityTable).where(eq(identityTable.id, id));
    return updated ?? null;
  },

  async deleteById(id: string): Promise<boolean> {
    const result = await db.delete(identityTable).where(eq(identityTable.id, id));
    return Number(result.rowsAffected ?? 0) > 0;
  }
};
