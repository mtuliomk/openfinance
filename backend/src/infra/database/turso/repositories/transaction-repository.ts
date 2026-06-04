import { desc, eq } from 'drizzle-orm';

import type {
  TransactionCreateInput,
  TransactionRecord,
  TransactionRepository,
  TransactionUpdateInput
} from '../../../../modules/transaction/transaction.types.js';
import { db } from '../drizzle-db.js';
import { transactionTable } from '../schema/transaction.js';

function toDbCreateInput(input: TransactionCreateInput): typeof transactionTable.$inferInsert {
  return {
    id: input.id,
    accountId: input.accountId,
    date: input.date,
    description: input.description,
    descriptionRaw: input.descriptionRaw,
    type: input.type,
    amount: input.amount,
    amountInAccountCurrency: input.amountInAccountCurrency,
    balance: input.balance,
    currencyCode: input.currencyCode,
    category: input.category,
    status: input.status ?? null,
    providerCode: input.providerCode ?? null,
    paymentData: input.paymentData ? (input.paymentData as unknown as Record<string, unknown>) : null,
    creditCardMetadata: input.creditCardMetadata
      ? (input.creditCardMetadata as unknown as Record<string, unknown>)
      : null,
    merchant: input.merchant ? (input.merchant as unknown as Record<string, unknown>) : null,
    categoryId: input.categoryId,
    operationType: input.operationType,
    providerId: input.providerId,
    createdAt: input.createdAt,
    updatedAt: input.updatedAt
  };
}

function toDbUpdateInput(input: TransactionUpdateInput): Partial<typeof transactionTable.$inferInsert> {
  const mapped = {
    accountId: input.accountId,
    date: input.date,
    description: input.description,
    descriptionRaw: input.descriptionRaw,
    type: input.type,
    amount: input.amount,
    amountInAccountCurrency: input.amountInAccountCurrency,
    balance: input.balance,
    currencyCode: input.currencyCode,
    category: input.category,
    status: input.status,
    providerCode: input.providerCode,
    paymentData: input.paymentData ? (input.paymentData as unknown as Record<string, unknown>) : null,
    creditCardMetadata: input.creditCardMetadata
      ? (input.creditCardMetadata as unknown as Record<string, unknown>)
      : null,
    merchant: input.merchant ? (input.merchant as unknown as Record<string, unknown>) : null,
    categoryId: input.categoryId,
    operationType: input.operationType,
    providerId: input.providerId,
    createdAt: input.createdAt,
    updatedAt: input.updatedAt
  };

  return Object.fromEntries(
    Object.entries(mapped).filter(([, value]) => value !== undefined)
  ) as Partial<typeof transactionTable.$inferInsert>;
}

export const transactionRepository: TransactionRepository = {
  async create(input: TransactionCreateInput): Promise<TransactionRecord> {
    await db.insert(transactionTable).values(toDbCreateInput(input));
    const [created] = await db.select().from(transactionTable).where(eq(transactionTable.id, input.id));

    if (!created) {
      throw new Error('Failed to create transaction');
    }

    return created as TransactionRecord;
  },

  async list(): Promise<TransactionRecord[]> {
    const records = await db.select().from(transactionTable).orderBy(desc(transactionTable.createdAt));
    return records as TransactionRecord[];
  },

  async existsByAccountId(accountId: string): Promise<boolean> {
    const [record] = await db.select({ id: transactionTable.id }).from(transactionTable).where(eq(transactionTable.accountId, accountId)).limit(1);
    return Boolean(record);
  },

  async getById(id: string): Promise<TransactionRecord | null> {
    const [transaction] = await db.select().from(transactionTable).where(eq(transactionTable.id, id));
    return (transaction as TransactionRecord | undefined) ?? null;
  },

  async updateById(id: string, input: TransactionUpdateInput): Promise<TransactionRecord | null> {
    await db.update(transactionTable).set(toDbUpdateInput(input)).where(eq(transactionTable.id, id));
    const [updated] = await db.select().from(transactionTable).where(eq(transactionTable.id, id));
    return (updated as TransactionRecord | undefined) ?? null;
  },

  async deleteById(id: string): Promise<boolean> {
    const result = await db.delete(transactionTable).where(eq(transactionTable.id, id));
    return Number(result.rowsAffected ?? 0) > 0;
  }
};
