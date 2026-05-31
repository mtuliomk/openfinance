import { z } from 'zod';

const envSchema = z.object({
  PROXY_SIGNING_SECRET: z.string().min(8),
  PROXY_ALLOWED_ORIGINS: z.string().min(1),
  LAMBDA_HEALTH_URL: z.url(),
  LAMBDA_AUTH_GOOGLE_START_URL: z.url(),
  LAMBDA_AUTH_GOOGLE_CALLBACK_URL: z.url(),
  LAMBDA_CONSENT_URL: z.url(),
  LAMBDA_ACCOUNT_URL: z.url(),
  LAMBDA_TRANSACTION_URL: z.url(),
  LAMBDA_INVESTMENT_URL: z.url(),
  LAMBDA_LOAN_URL: z.url(),
  LAMBDA_BILL_URL: z.url(),
  LAMBDA_IDENTITY_URL: z.url(),
  LAMBDA_ITEMS_URL: z.url(),
  LAMBDA_OPENFINANCE_RELOAD_URL: z.url()
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
