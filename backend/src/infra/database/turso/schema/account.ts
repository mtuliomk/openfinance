import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const accountTable = sqliteTable('account', {
  id: text('id').primaryKey().notNull(),
  type: text('type').notNull(),
  subtype: text('subtype'),
  number: text('number'),
  name: text('name'),
  marketingName: text('marketing_name'),
  balance: integer('balance'),
  initialBalance: integer('initial_balance').notNull().default(0),
  itemId: text('item_id').notNull(),
  taxNumber: text('tax_number'),
  owner: text('owner'),
  currencyCode: text('currency_code'),
  bankData: text('bank_data', { mode: 'json' }).$type<{
    transferNumber: string | null;
    closingBalance: number | null;
    automaticallyInvestedBalance: number | null;
    overdraftUsedLimit: number | null;
    unarrangedOverdraftAmount: number | null;
  } | null>(),
  creditData: text('credit_data', { mode: 'json' }).$type<{
    level: string | null;
    brand: string | null;
    balanceCloseDate: string | null;
    balanceDueDate: string | null;
    availableCreditLimit: number | null;
    balanceForeignCurrency: number | null;
    minimumPayment: number | null;
    creditLimit: number | null;
    isLimitFlexible: boolean | null;
    status: 'ACTIVE' | 'BLOCKED' | 'CANCELLED' | null;
    holderType: 'MAIN' | 'ADDITIONAL' | null;
  } | null>()
});
