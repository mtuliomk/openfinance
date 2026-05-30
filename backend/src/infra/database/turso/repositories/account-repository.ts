import { eq } from 'drizzle-orm';

import type {
  AccountCreateInput,
  AccountRecord,
  AccountRepository,
  AccountUpdateInput
} from '../../../../modules/account/account.types.js';
import { db } from '../drizzle-db.js';
import { accountTable } from '../schema/account.js';

export const accountRepository: AccountRepository = {
  async create(input: AccountCreateInput): Promise<AccountRecord> {
    await db.insert(accountTable).values(input);
    const [created] = await db.select().from(accountTable).where(eq(accountTable.id, input.id));

    if (!created) {
      throw new Error('Failed to create account');
    }

    return created;
  },

  async list(): Promise<AccountRecord[]> {
    return db.select().from(accountTable);
  },

  async getById(id: string): Promise<AccountRecord | null> {
    const [account] = await db.select().from(accountTable).where(eq(accountTable.id, id));
    return account ?? null;
  },

  async updateById(id: string, input: AccountUpdateInput): Promise<AccountRecord | null> {
    await db.update(accountTable).set(input).where(eq(accountTable.id, id));
    const [updated] = await db.select().from(accountTable).where(eq(accountTable.id, id));
    return updated ?? null;
  },

  async deleteById(id: string): Promise<boolean> {
    const result = await db.delete(accountTable).where(eq(accountTable.id, id));
    return Number(result.rowsAffected ?? 0) > 0;
  }
};
