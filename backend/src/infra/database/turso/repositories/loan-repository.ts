import { eq } from 'drizzle-orm';

import type { LoanCreateInput, LoanRecord, LoanRepository, LoanUpdateInput } from '../../../../modules/loan/loan.types.js';
import { db } from '../drizzle-db.js';
import { loanTable } from '../schema/loan.js';

export const loanRepository: LoanRepository = {
  async create(input: LoanCreateInput): Promise<LoanRecord> {
    await db.insert(loanTable).values(input);
    const [created] = await db.select().from(loanTable).where(eq(loanTable.id, input.id));

    if (!created) {
      throw new Error('Failed to create loan');
    }

    return created;
  },

  async list(): Promise<LoanRecord[]> {
    return db.select().from(loanTable);
  },

  async getById(id: string): Promise<LoanRecord | null> {
    const [loan] = await db.select().from(loanTable).where(eq(loanTable.id, id));
    return loan ?? null;
  },

  async updateById(id: string, input: LoanUpdateInput): Promise<LoanRecord | null> {
    await db.update(loanTable).set(input).where(eq(loanTable.id, id));
    const [updated] = await db.select().from(loanTable).where(eq(loanTable.id, id));
    return updated ?? null;
  },

  async deleteById(id: string): Promise<boolean> {
    const result = await db.delete(loanTable).where(eq(loanTable.id, id));
    return Number(result.rowsAffected ?? 0) > 0;
  }
};
