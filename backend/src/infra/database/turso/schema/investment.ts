import { sql } from 'drizzle-orm';
import { real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { itemsTable } from './items.js';

export const investmentTable = sqliteTable('investment', {
  id: text('id').primaryKey().notNull(),
  itemId: text('item_id')
    .notNull()
    .references(() => itemsTable.id),
  code: text('code'),
  issuerCnpj: text('issuer_cnpj'),
  number: text('number'),
  isin: text('isin'),
  type: text('type').notNull(),
  subtype: text('subtype'),
  status: text('status'),
  name: text('name').notNull(),
  currencyCode: text('currency_code').notNull(),
  date: text('date'),
  dueDate: text('due_date'),
  issueDate: text('issue_date'),
  purchaseDate: text('purchase_date'),
  value: real('value'),
  quantity: real('quantity'),
  taxes: real('taxes'),
  taxes2: real('taxes2'),
  balance: real('balance').notNull(),
  amount: real('amount'),
  amountWithdrawal: real('amount_withdrawal'),
  amountProfit: real('amount_profit'),
  amountOriginal: real('amount_original'),
  issuer: text('issuer'),
  rate: real('rate'),
  rateType: text('rate_type'),
  fixedAnnualRate: real('fixed_annual_rate'),
  lastMonthRate: real('last_month_rate'),
  annualRate: real('annual_rate'),
  lastTwelveMonthsRate: real('last_twelve_months_rate'),
  owner: text('owner'),
  metadata: text('metadata', { mode: 'json' }).$type<{
    taxRegime: string | null;
    proposalNumber: string | null;
    processNumber: string | null;
  } | null>(),
  institution: text('institution', { mode: 'json' }).$type<{
    name: string | null;
    number: string | null;
  } | null>(),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`)
});
