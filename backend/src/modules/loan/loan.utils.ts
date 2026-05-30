import { z } from 'zod';

const jsonObjectSchema = z.record(z.string(), z.unknown());
const jsonObjectArraySchema = z.array(jsonObjectSchema);

export const loanIdSchema = z.string().min(1);

export const loanCreateSchema = z.object({
  id: z.string().min(1),
  itemId: z.uuid(),
  contractNumber: z.string().nullable(),
  ipocCode: z.string().nullable(),
  productName: z.string().min(1),
  type: z.string().nullable(),
  date: z.iso.datetime().nullable(),
  contractDate: z.iso.datetime().nullable(),
  disbursementDates: z.array(z.iso.datetime()).nullable(),
  settlementDate: z.iso.datetime().nullable(),
  contractAmount: z.number().nullable(),
  currencyCode: z.string().min(1),
  dueDate: z.iso.datetime().nullable(),
  installmentPeriodicity: z.string().nullable(),
  installmentPeriodicityAdditionalInfo: z.string().nullable(),
  firstInstallmentDueDate: z.iso.datetime().nullable(),
  cet: z.number().nullable(),
  amortizationScheduled: z.string().nullable(),
  amortizationScheduledAdditionalInfo: z.string().nullable(),
  cnpjConsignee: z.string().nullable(),
  interestRates: jsonObjectArraySchema.nullable(),
  contractedFees: jsonObjectArraySchema.nullable(),
  contractedFinanceCharges: jsonObjectArraySchema.nullable(),
  warranties: jsonObjectArraySchema.nullable(),
  installments: jsonObjectSchema.nullable(),
  payments: jsonObjectSchema.nullable()
});

export const loanUpdateSchema = z
  .object({
    itemId: z.uuid().optional(),
    contractNumber: z.string().nullable().optional(),
    ipocCode: z.string().nullable().optional(),
    productName: z.string().min(1).optional(),
    type: z.string().nullable().optional(),
    date: z.iso.datetime().nullable().optional(),
    contractDate: z.iso.datetime().nullable().optional(),
    disbursementDates: z.array(z.iso.datetime()).nullable().optional(),
    settlementDate: z.iso.datetime().nullable().optional(),
    contractAmount: z.number().nullable().optional(),
    currencyCode: z.string().min(1).optional(),
    dueDate: z.iso.datetime().nullable().optional(),
    installmentPeriodicity: z.string().nullable().optional(),
    installmentPeriodicityAdditionalInfo: z.string().nullable().optional(),
    firstInstallmentDueDate: z.iso.datetime().nullable().optional(),
    cet: z.number().nullable().optional(),
    amortizationScheduled: z.string().nullable().optional(),
    amortizationScheduledAdditionalInfo: z.string().nullable().optional(),
    cnpjConsignee: z.string().nullable().optional(),
    interestRates: jsonObjectArraySchema.nullable().optional(),
    contractedFees: jsonObjectArraySchema.nullable().optional(),
    contractedFinanceCharges: jsonObjectArraySchema.nullable().optional(),
    warranties: jsonObjectArraySchema.nullable().optional(),
    installments: jsonObjectSchema.nullable().optional(),
    payments: jsonObjectSchema.nullable().optional()
  })
  .refine((value) => Object.keys(value).length > 0, 'At least one field must be informed for update');
