import { z } from 'zod';

const investmentTypeSchema = z.enum([
  'MUTUAL_FUND',
  'SECURITY',
  'EQUITY',
  'COE',
  'FIXED_INCOME',
  'ETF',
  'OTHER'
]);

const investmentStatusSchema = z.enum(['ACTIVE', 'PENDING', 'TOTAL_WITHDRAWAL']);

const investmentMetadataSchema = z.object({
  taxRegime: z.string().nullable(),
  proposalNumber: z.string().nullable(),
  processNumber: z.string().nullable()
});

const investmentInstitutionSchema = z.object({
  name: z.string().nullable(),
  number: z.string().nullable()
});

export const investmentIdSchema = z.string().min(1);

export const investmentCreateSchema = z.object({
  id: z.string().min(1),
  itemId: z.uuid(),
  code: z.string().nullable(),
  issuerCnpj: z.string().nullable(),
  number: z.string().nullable(),
  isin: z.string().nullable(),
  type: investmentTypeSchema,
  subtype: z.string().nullable(),
  status: investmentStatusSchema.nullable(),
  name: z.string().min(1),
  currencyCode: z.string().min(1),
  date: z.iso.datetime().nullable(),
  dueDate: z.iso.datetime().nullable(),
  issueDate: z.iso.datetime().nullable(),
  purchaseDate: z.iso.datetime().nullable(),
  value: z.number().nullable(),
  quantity: z.number().nullable(),
  taxes: z.number().nullable(),
  taxes2: z.number().nullable(),
  balance: z.number(),
  amount: z.number().nullable(),
  amountWithdrawal: z.number().nullable(),
  amountProfit: z.number().nullable(),
  amountOriginal: z.number().nullable(),
  issuer: z.string().nullable(),
  rate: z.number().nullable(),
  rateType: z.string().nullable(),
  fixedAnnualRate: z.number().nullable(),
  lastMonthRate: z.number().nullable(),
  annualRate: z.number().nullable(),
  lastTwelveMonthsRate: z.number().nullable(),
  owner: z.string().nullable(),
  metadata: investmentMetadataSchema.nullable(),
  institution: investmentInstitutionSchema.nullable(),
  createdAt: z.iso.datetime().optional(),
  updatedAt: z.iso.datetime().optional()
});

export const investmentUpdateSchema = z
  .object({
    itemId: z.uuid().optional(),
    code: z.string().nullable().optional(),
    issuerCnpj: z.string().nullable().optional(),
    number: z.string().nullable().optional(),
    isin: z.string().nullable().optional(),
    type: investmentTypeSchema.optional(),
    subtype: z.string().nullable().optional(),
    status: investmentStatusSchema.nullable().optional(),
    name: z.string().min(1).optional(),
    currencyCode: z.string().min(1).optional(),
    date: z.iso.datetime().nullable().optional(),
    dueDate: z.iso.datetime().nullable().optional(),
    issueDate: z.iso.datetime().nullable().optional(),
    purchaseDate: z.iso.datetime().nullable().optional(),
    value: z.number().nullable().optional(),
    quantity: z.number().nullable().optional(),
    taxes: z.number().nullable().optional(),
    taxes2: z.number().nullable().optional(),
    balance: z.number().optional(),
    amount: z.number().nullable().optional(),
    amountWithdrawal: z.number().nullable().optional(),
    amountProfit: z.number().nullable().optional(),
    amountOriginal: z.number().nullable().optional(),
    issuer: z.string().nullable().optional(),
    rate: z.number().nullable().optional(),
    rateType: z.string().nullable().optional(),
    fixedAnnualRate: z.number().nullable().optional(),
    lastMonthRate: z.number().nullable().optional(),
    annualRate: z.number().nullable().optional(),
    lastTwelveMonthsRate: z.number().nullable().optional(),
    owner: z.string().nullable().optional(),
    metadata: investmentMetadataSchema.nullable().optional(),
    institution: investmentInstitutionSchema.nullable().optional(),
    createdAt: z.iso.datetime().optional(),
    updatedAt: z.iso.datetime().optional()
  })
  .refine((value) => Object.keys(value).length > 0, 'At least one field must be informed for update');
