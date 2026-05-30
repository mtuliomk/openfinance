import { sql } from 'drizzle-orm';
import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core';

export const itemsTable = sqliteTable('items', {
  id: text('id').primaryKey().notNull(),
  provider: text('provider').notNull().default('MeuPluggy'),
  connector: text('connector', { mode: 'json' }).$type<Record<string, unknown> | null>().default(null),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  status: text('status').notNull(),
  executionStatus: text('execution_status').notNull(),
  lastUpdatedAt: text('last_updated_at'),
  webhookUrl: text('webhook_url'),
  error: text('error', { mode: 'json' }).$type<Record<string, unknown> | null>().default(null),
  clientUserId: text('client_user_id'),
  consecutiveFailedLoginAttempts: integer('consecutive_failed_login_attempts').notNull().default(0),
  statusDetail: text('status_detail', { mode: 'json' }).$type<Record<string, unknown> | null>().default(null),
  parameter: text('parameter', { mode: 'json' }).$type<Record<string, unknown> | null>().default(null),
  userAction: text('user_action', { mode: 'json' }).$type<Record<string, unknown> | null>().default(null),
  nextAutoSyncAt: text('next_auto_sync_at'),
  consentExpiresAt: text('consent_expires_at'),
  products: text('products', { mode: 'json' }).$type<string[]>().notNull().default(sql`'[]'`),
  oauthRedirectUri: text('oauth_redirect_uri')
});
