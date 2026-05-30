import { real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { itemsTable } from './items.js';

export const loanTable = sqliteTable('loan', {
  id: text('id').primaryKey().notNull(),
  itemId: text('item_id')
    .notNull()
    .references(() => itemsTable.id),
  contractNumber: text('contract_number'),
  ipocCode: text('ipoc_code'),
  productName: text('product_name').notNull(),
  type: text('type'),
  date: text('date'),
  contractDate: text('contract_date'),
  disbursementDates: text('disbursement_dates', { mode: 'json' }).$type<string[] | null>(),
  settlementDate: text('settlement_date'),
  contractAmount: real('contract_amount'),
  currencyCode: text('currency_code').notNull(),
  dueDate: text('due_date'),
  installmentPeriodicity: text('installment_periodicity'),
  installmentPeriodicityAdditionalInfo: text('installment_periodicity_additional_info'),
  firstInstallmentDueDate: text('first_installment_due_date'),
  cet: real('cet'),
  amortizationScheduled: text('amortization_scheduled'),
  amortizationScheduledAdditionalInfo: text('amortization_scheduled_additional_info'),
  cnpjConsignee: text('cnpj_consignee'),
  interestRates: text('interest_rates', { mode: 'json' }).$type<Record<string, unknown>[] | null>(),
  contractedFees: text('contracted_fees', { mode: 'json' }).$type<Record<string, unknown>[] | null>(),
  contractedFinanceCharges: text('contracted_finance_charges', { mode: 'json' }).$type<Record<string, unknown>[] | null>(),
  warranties: text('warranties', { mode: 'json' }).$type<Record<string, unknown>[] | null>(),
  installments: text('installments', { mode: 'json' }).$type<Record<string, unknown> | null>(),
  payments: text('payments', { mode: 'json' }).$type<Record<string, unknown> | null>()
});
