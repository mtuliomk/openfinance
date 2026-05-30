import { z } from 'zod';

const jsonObjectSchema = z.record(z.string(), z.unknown());

export const billIdSchema = z.string().min(1);

export const billCreateSchema = z.object({
  id: z.string().min(1),
  accountId: z.uuid(),
  dueDate: z.iso.datetime(),
  totalAmount: z.number(),
  totalAmountCurrencyCode: z.string().min(1),
  minimumPaymentAmount: z.number().nullable(),
  allowsInstallments: z.boolean().nullable(),
  financeCharges: z.array(jsonObjectSchema),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime()
});

export const billUpdateSchema = z
  .object({
    accountId: z.uuid().optional(),
    dueDate: z.iso.datetime().optional(),
    totalAmount: z.number().optional(),
    totalAmountCurrencyCode: z.string().min(1).optional(),
    minimumPaymentAmount: z.number().nullable().optional(),
    allowsInstallments: z.boolean().nullable().optional(),
    financeCharges: z.array(jsonObjectSchema).optional(),
    createdAt: z.iso.datetime().optional(),
    updatedAt: z.iso.datetime().optional()
  })
  .refine((value) => Object.keys(value).length > 0, 'At least one field must be informed for update');
