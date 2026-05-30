import { z } from 'zod';

export const googleStartQuerySchema = z.object({
  returnTo: z.string().startsWith('/').optional().default('/auth/callback')
});

export const googleCallbackQuerySchema = z.object({
  code: z.string().min(1),
  state: z.string().min(1)
});

export function buildStateToken(): string {
  return crypto.randomUUID();
}
