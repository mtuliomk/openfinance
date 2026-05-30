import { z } from 'zod';

const jsonObjectSchema = z.record(z.string(), z.unknown());
const jsonObjectArraySchema = z.array(jsonObjectSchema);

export const identityIdSchema = z.string().min(1);

export const identityCreateSchema = z.object({
  id: z.string().min(1),
  itemId: z.uuid(),
  birthDate: z.iso.datetime().nullable(),
  taxNumber: z.string().nullable(),
  document: z.string().nullable(),
  documentType: z.string().nullable(),
  jobTitle: z.string().nullable(),
  companyName: z.string().nullable(),
  fullName: z.string().nullable(),
  phoneNumbers: jsonObjectArraySchema.nullable(),
  emails: jsonObjectArraySchema.nullable(),
  addresses: jsonObjectArraySchema.nullable(),
  relations: jsonObjectArraySchema.nullable(),
  investorProfile: z.enum(['Conservative', 'Moderate', 'Aggressive']).nullable(),
  establishmentName: z.string().nullable(),
  establishmentCode: z.string().nullable(),
  financialRelationships: jsonObjectSchema.nullable(),
  qualifications: jsonObjectSchema.nullable(),
  socialName: z.string().nullable(),
  sex: z.enum(['FEMALE', 'MALE', 'OTHER']).nullable(),
  maritalStatus: jsonObjectSchema.nullable(),
  nationality: jsonObjectSchema.nullable(),
  otherDocuments: jsonObjectArraySchema.nullable(),
  passport: jsonObjectSchema.nullable(),
  incorporationDate: z.iso.datetime().nullable(),
  parties: jsonObjectArraySchema.nullable(),
  businessOtherDocuments: jsonObjectArraySchema.nullable(),
  companiesCnpj: z.array(z.string()).nullable(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime()
});

export const identityUpdateSchema = z
  .object({
    itemId: z.uuid().optional(),
    birthDate: z.iso.datetime().nullable().optional(),
    taxNumber: z.string().nullable().optional(),
    document: z.string().nullable().optional(),
    documentType: z.string().nullable().optional(),
    jobTitle: z.string().nullable().optional(),
    companyName: z.string().nullable().optional(),
    fullName: z.string().nullable().optional(),
    phoneNumbers: jsonObjectArraySchema.nullable().optional(),
    emails: jsonObjectArraySchema.nullable().optional(),
    addresses: jsonObjectArraySchema.nullable().optional(),
    relations: jsonObjectArraySchema.nullable().optional(),
    investorProfile: z.enum(['Conservative', 'Moderate', 'Aggressive']).nullable().optional(),
    establishmentName: z.string().nullable().optional(),
    establishmentCode: z.string().nullable().optional(),
    financialRelationships: jsonObjectSchema.nullable().optional(),
    qualifications: jsonObjectSchema.nullable().optional(),
    socialName: z.string().nullable().optional(),
    sex: z.enum(['FEMALE', 'MALE', 'OTHER']).nullable().optional(),
    maritalStatus: jsonObjectSchema.nullable().optional(),
    nationality: jsonObjectSchema.nullable().optional(),
    otherDocuments: jsonObjectArraySchema.nullable().optional(),
    passport: jsonObjectSchema.nullable().optional(),
    incorporationDate: z.iso.datetime().nullable().optional(),
    parties: jsonObjectArraySchema.nullable().optional(),
    businessOtherDocuments: jsonObjectArraySchema.nullable().optional(),
    companiesCnpj: z.array(z.string()).nullable().optional(),
    createdAt: z.iso.datetime().optional(),
    updatedAt: z.iso.datetime().optional()
  })
  .refine((value) => Object.keys(value).length > 0, 'At least one field must be informed for update');
