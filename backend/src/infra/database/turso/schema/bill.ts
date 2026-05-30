import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { accountTable } from './account.js';

export const billTable = sqliteTable('bill', {
  id: text('id').primaryKey().notNull(),
  accountId: text('account_id')
    .notNull()
    .references(() => accountTable.id),
  dueDate: text('due_date').notNull(),
  totalAmount: real('total_amount').notNull(),
  totalAmountCurrencyCode: text('total_amount_currency_code').notNull(),
  minimumPaymentAmount: real('minimum_payment_amount'),
  allowsInstallments: integer('allows_installments', { mode: 'boolean' }),
  financeCharges: text('finance_charges', { mode: 'json' }).$type<Record<string, unknown>[]>().notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull()
});
