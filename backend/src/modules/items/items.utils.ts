import { z } from 'zod';

export const itemIdSchema = z.uuid();

export const itemUpdateSchema = z
  .object({
    provider: z.string().min(1).optional(),
    connector: z.record(z.string(), z.unknown()).nullable().optional(),
    status: z.string().min(1).optional(),
    executionStatus: z.string().min(1).optional(),
    lastUpdatedAt: z.iso.datetime().nullable().optional(),
    webhookUrl: z.url().nullable().optional(),
    error: z.record(z.string(), z.unknown()).nullable().optional(),
    clientUserId: z.string().min(1).optional(),
    consecutiveFailedLoginAttempts: z.number().int().min(0).optional(),
    statusDetail: z.record(z.string(), z.unknown()).nullable().optional(),
    parameter: z.record(z.string(), z.unknown()).nullable().optional(),
    userAction: z.record(z.string(), z.unknown()).nullable().optional(),
    nextAutoSyncAt: z.iso.datetime().nullable().optional(),
    consentExpiresAt: z.iso.datetime().nullable().optional(),
    products: z.array(z.string()).optional(),
    oauthRedirectUri: z.url().nullable().optional()
  })
  .refine((value) => Object.keys(value).length > 0, 'At least one field must be informed for update');
