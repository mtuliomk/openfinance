import { eq } from 'drizzle-orm';

import type {
  InvestmentCreateInput,
  InvestmentRecord,
  InvestmentRepository,
  InvestmentUpdateInput
} from '../../../../modules/investment/investment.types.js';
import { db } from '../drizzle-db.js';
import { investmentTable } from '../schema/investment.js';

function toDbCreateInput(input: InvestmentCreateInput): typeof investmentTable.$inferInsert {
  return {
    ...input,
    createdAt: input.createdAt,
    updatedAt: input.updatedAt
  };
}

function toDbUpdateInput(input: InvestmentUpdateInput): Partial<typeof investmentTable.$inferInsert> {
  return Object.fromEntries(
    Object.entries(input).filter(([, value]) => value !== undefined)
  ) as Partial<typeof investmentTable.$inferInsert>;
}

export const investmentRepository: InvestmentRepository = {
  async create(input: InvestmentCreateInput): Promise<InvestmentRecord> {
    await db.insert(investmentTable).values(toDbCreateInput(input));
    const [created] = await db.select().from(investmentTable).where(eq(investmentTable.id, input.id));

    if (!created) {
      throw new Error('Failed to create investment');
    }

    return created as InvestmentRecord;
  },

  async list(): Promise<InvestmentRecord[]> {
    const records = await db.select().from(investmentTable);
    return records as InvestmentRecord[];
  },

  async getById(id: string): Promise<InvestmentRecord | null> {
    const [investment] = await db.select().from(investmentTable).where(eq(investmentTable.id, id));
    return (investment as InvestmentRecord | undefined) ?? null;
  },

  async updateById(id: string, input: InvestmentUpdateInput): Promise<InvestmentRecord | null> {
    await db.update(investmentTable).set(toDbUpdateInput(input)).where(eq(investmentTable.id, id));
    const [updated] = await db.select().from(investmentTable).where(eq(investmentTable.id, id));
    return (updated as InvestmentRecord | undefined) ?? null;
  },

  async deleteById(id: string): Promise<boolean> {
    const result = await db.delete(investmentTable).where(eq(investmentTable.id, id));
    return Number(result.rowsAffected ?? 0) > 0;
  }
};
