import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { itemsTable } from './items.js';

export const consentTable = sqliteTable('consent', {
  id: text('id').primaryKey().notNull(),
  itemId: text('item_id')
    .notNull()
    .references(() => itemsTable.id),
  products: text('products', { mode: 'json' }).$type<string[]>().notNull(),
  openFinancePermissionsGranted: text('open_finance_permissions_granted', { mode: 'json' })
    .$type<string[]>()
    .notNull(),
  createdAt: text('created_at').notNull(),
  expiresAt: text('expires_at'),
  revokedAt: text('revoked_at')
});
