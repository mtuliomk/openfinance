import { z } from 'zod';

export const proxyPayloadSchema = z.object({
  iss: z.string(),
  aud: z.string(),
  sub: z.string(),
  jti: z.string(),
  iat: z.number(),
  exp: z.number(),
  scope: z.string()
});

export function fromBase64Url(value: string): string {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  return Buffer.from(normalized, 'base64').toString('utf-8');
}
