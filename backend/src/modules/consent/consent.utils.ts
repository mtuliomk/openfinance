import { z } from 'zod';

export const consentIdSchema = z.string().min(1);

export const consentCreateSchema = z.object({
  id: z.string().min(1),
  itemId: z.uuid(),
  products: z.array(z.string()),
  openFinancePermissionsGranted: z.array(z.string()),
  createdAt: z.iso.datetime(),
  expiresAt: z.iso.datetime().nullable(),
  revokedAt: z.iso.datetime().nullable()
});

export const consentUpdateSchema = z
  .object({
    itemId: z.uuid().optional(),
    products: z.array(z.string()).optional(),
    openFinancePermissionsGranted: z.array(z.string()).optional(),
    createdAt: z.iso.datetime().optional(),
    expiresAt: z.iso.datetime().nullable().optional(),
    revokedAt: z.iso.datetime().nullable().optional()
  })
  .refine((value) => Object.keys(value).length > 0, 'At least one field must be informed for update');
