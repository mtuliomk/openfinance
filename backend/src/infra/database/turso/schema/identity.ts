import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { itemsTable } from './items.js';

export const identityTable = sqliteTable('identity', {
  id: text('id').primaryKey().notNull(),
  itemId: text('item_id')
    .notNull()
    .references(() => itemsTable.id),
  birthDate: text('birth_date'),
  taxNumber: text('tax_number'),
  document: text('document'),
  documentType: text('document_type'),
  jobTitle: text('job_title'),
  companyName: text('company_name'),
  fullName: text('full_name'),
  phoneNumbers: text('phone_numbers', { mode: 'json' }).$type<Record<string, unknown>[] | null>(),
  emails: text('emails', { mode: 'json' }).$type<Record<string, unknown>[] | null>(),
  addresses: text('addresses', { mode: 'json' }).$type<Record<string, unknown>[] | null>(),
  relations: text('relations', { mode: 'json' }).$type<Record<string, unknown>[] | null>(),
  investorProfile: text('investor_profile').$type<'Conservative' | 'Moderate' | 'Aggressive' | null>(),
  establishmentName: text('establishment_name'),
  establishmentCode: text('establishment_code'),
  financialRelationships: text('financial_relationships', { mode: 'json' }).$type<Record<string, unknown> | null>(),
  qualifications: text('qualifications', { mode: 'json' }).$type<Record<string, unknown> | null>(),
  socialName: text('social_name'),
  sex: text('sex').$type<'FEMALE' | 'MALE' | 'OTHER' | null>(),
  maritalStatus: text('marital_status', { mode: 'json' }).$type<Record<string, unknown> | null>(),
  nationality: text('nationality', { mode: 'json' }).$type<Record<string, unknown> | null>(),
  otherDocuments: text('other_documents', { mode: 'json' }).$type<Record<string, unknown>[] | null>(),
  passport: text('passport', { mode: 'json' }).$type<Record<string, unknown> | null>(),
  incorporationDate: text('incorporation_date'),
  parties: text('parties', { mode: 'json' }).$type<Record<string, unknown>[] | null>(),
  businessOtherDocuments: text('business_other_documents', { mode: 'json' }).$type<Record<string, unknown>[] | null>(),
  companiesCnpj: text('companies_cnpj', { mode: 'json' }).$type<string[] | null>(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull()
});
