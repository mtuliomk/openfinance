import { sql } from 'drizzle-orm';
import { real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { accountTable } from './account.js';

export const transactionTable = sqliteTable('transaction', {
  id: text('id').primaryKey().notNull(),
  accountId: text('account_id')
    .notNull()
    .references(() => accountTable.id),
  date: text('date').notNull(),
  description: text('description').notNull(),
  descriptionRaw: text('description_raw'),
  type: text('type').notNull().$type<'DEBIT' | 'CREDIT'>(),
  amount: real('amount').notNull(),
  amountInAccountCurrency: real('amount_in_account_currency'),
  balance: real('balance').notNull(),
  currencyCode: text('currency_code').notNull(),
  category: text('category'),
  status: text('status').$type<'PENDING' | 'POSTED' | null>(),
  providerCode: text('provider_code'),
  paymentData: text('payment_data', { mode: 'json' }).$type<Record<string, unknown> | null>(),
  creditCardMetadata: text('credit_card_metadata', { mode: 'json' }).$type<Record<string, unknown> | null>(),
  merchant: text('merchant', { mode: 'json' }).$type<Record<string, unknown> | null>(),
  categoryId: text('category_id'),
  operationType: text('operation_type'),
  providerId: text('provider_id'),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`)
});
