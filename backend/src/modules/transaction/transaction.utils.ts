import { z } from 'zod';

export const transactionIdSchema = z.string().min(1);

const transactionPaymentParticipantDocumentSchema = z.object({
  value: z.string().optional(),
  type: z.enum(['CPF', 'CNPJ']).optional()
});

const transactionPaymentParticipantSchema = z.object({
  documentNumber: transactionPaymentParticipantDocumentSchema.optional(),
  name: z.string().optional(),
  accountNumber: z.string().optional(),
  branchNumber: z.string().optional(),
  routingNumber: z.string().optional(),
  routingNumberISPB: z.string().optional()
});

const transactionBoletoMetadataResponseSchema = z.object({
  digitableLine: z.string().nullable(),
  barcode: z.string().nullable(),
  baseAmount: z.number().nullable(),
  penaltyAmount: z.number().nullable(),
  interestAmount: z.number().nullable(),
  discountAmount: z.number().nullable()
});

const transactionPaymentDataSchema = z.object({
  payer: transactionPaymentParticipantSchema.optional(),
  receiver: transactionPaymentParticipantSchema.optional(),
  receiverReferenceId: z.string().optional(),
  paymentMethod: z.string().optional(),
  referenceNumber: z.string().optional(),
  reason: z.string().optional(),
  boletoMetadata: transactionBoletoMetadataResponseSchema.nullable()
});

const creditCardMetadataSchema = z.object({
  installmentNumber: z.number().optional(),
  totalInstallments: z.number().optional(),
  totalAmount: z.number().optional(),
  payeeMCC: z.number().optional(),
  purchaseDate: z.iso.datetime().optional(),
  billId: z.string().optional(),
  cardNumber: z.string().optional()
});

const transactionMerchantDataSchema = z.object({
  name: z.string(),
  businessName: z.string(),
  cnpj: z.string(),
  cnae: z.string().optional(),
  category: z.string().optional()
});

export const transactionCreateSchema = z.object({
  id: z.string().min(1),
  accountId: z.uuid(),
  date: z.iso.datetime(),
  description: z.string().min(1),
  descriptionRaw: z.string().nullable(),
  type: z.enum(['DEBIT', 'CREDIT']),
  amount: z.number(),
  amountInAccountCurrency: z.number().nullable(),
  balance: z.number(),
  currencyCode: z.string().min(1),
  category: z.string().nullable(),
  status: z.enum(['PENDING', 'POSTED']).nullable().optional(),
  providerCode: z.string().nullable().optional(),
  paymentData: transactionPaymentDataSchema.nullable(),
  creditCardMetadata: creditCardMetadataSchema.nullable(),
  merchant: transactionMerchantDataSchema.nullable(),
  categoryId: z.string().nullable(),
  operationType: z.string().nullable(),
  providerId: z.string().nullable(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime()
});

export const transactionUpdateSchema = z
  .object({
    accountId: z.uuid().optional(),
    date: z.iso.datetime().optional(),
    description: z.string().min(1).optional(),
    descriptionRaw: z.string().nullable().optional(),
    type: z.enum(['DEBIT', 'CREDIT']).optional(),
    amount: z.number().optional(),
    amountInAccountCurrency: z.number().nullable().optional(),
    balance: z.number().optional(),
    currencyCode: z.string().min(1).optional(),
    category: z.string().nullable().optional(),
    status: z.enum(['PENDING', 'POSTED']).nullable().optional(),
    providerCode: z.string().nullable().optional(),
    paymentData: transactionPaymentDataSchema.nullable().optional(),
    creditCardMetadata: creditCardMetadataSchema.nullable().optional(),
    merchant: transactionMerchantDataSchema.nullable().optional(),
    categoryId: z.string().nullable().optional(),
    operationType: z.string().nullable().optional(),
    providerId: z.string().nullable().optional(),
    createdAt: z.iso.datetime().optional(),
    updatedAt: z.iso.datetime().optional()
  })
  .refine((value) => Object.keys(value).length > 0, 'At least one field must be informed for update');
