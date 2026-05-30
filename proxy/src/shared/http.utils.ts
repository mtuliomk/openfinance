import { z } from 'zod';

const envSchema = z.object({
  BACKEND_BASE_URL: z.url(),
  PROXY_SIGNING_SECRET: z.string().min(8),
  PROXY_ALLOWED_ORIGINS: z.string().min(1)
});

export function parseEnv(env: unknown) {
  return envSchema.parse(env);
}

export function buildCorrelationId(): string {
  return crypto.randomUUID();
}

export function buildJsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8'
    }
  });
}

export function parseAllowedOrigins(raw: string): string[] {
  return raw.split(',').map((origin) => origin.trim()).filter(Boolean);
}
