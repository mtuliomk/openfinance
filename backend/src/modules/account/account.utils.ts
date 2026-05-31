import { z } from 'zod';

export const accountIdSchema = z.uuid();

const bankDataSchema = z.object({
  transferNumber: z.string().nullable(),
  closingBalance: z.number().nullable(),
  automaticallyInvestedBalance: z.number().int().nullable(),
  overdraftUsedLimit: z.number().nullable(),
  unarrangedOverdraftAmount: z.number().nullable()
});

const creditDataSchema = z.object({
  level: z.string().nullable(),
  brand: z.string().nullable(),
  balanceCloseDate: z.string().nullable(),
  balanceDueDate: z.string().nullable(),
  availableCreditLimit: z.number().nullable(),
  balanceForeignCurrency: z.number().nullable(),
  minimumPayment: z.number().nullable(),
  creditLimit: z.number().nullable(),
  isLimitFlexible: z.boolean().nullable(),
  status: z.enum(['ACTIVE', 'BLOCKED', 'CANCELLED']).nullable(),
  holderType: z.enum(['MAIN', 'ADDITIONAL']).nullable()
});

export const accountCreateSchema = z.object({
  id: z.uuid(),
  type: z.string().min(1),
  itemId: z.uuid(),
  subtype: z.string().optional(),
  number: z.string().optional(),
  name: z.string().optional(),
  marketingName: z.string().optional(),
  balance: z.number().int().optional(),
  initialBalance: z.number().int().optional(),
  taxNumber: z.string().optional(),
  owner: z.string().optional(),
  currencyCode: z.string().optional(),
  bankData: bankDataSchema.nullable().optional(),
  creditData: creditDataSchema.nullable().optional()
});

export const accountUpdateSchema = z
  .object({
    type: z.string().min(1).optional(),
    itemId: z.uuid().optional(),
    subtype: z.string().nullable().optional(),
    number: z.string().nullable().optional(),
    name: z.string().nullable().optional(),
    marketingName: z.string().nullable().optional(),
    balance: z.number().int().nullable().optional(),
    initialBalance: z.number().int().optional(),
    taxNumber: z.string().nullable().optional(),
    owner: z.string().nullable().optional(),
    currencyCode: z.string().nullable().optional(),
    bankData: bankDataSchema.nullable().optional(),
    creditData: creditDataSchema.nullable().optional()
  })
  .refine((value) => Object.keys(value).length > 0, 'At least one field must be informed for update');
