import { ALLOWED_LOGIN_EMAILS, type ProxyAuthPayload } from './proxy-auth.types';
import { buildExpiry, fromBytesToHex, toBase64Url } from './proxy-auth.utils';
import { z } from 'zod';

const allowedLoginEmails = new Set(ALLOWED_LOGIN_EMAILS);
const jwtPayloadSchema = z.object({
  email: z.email().transform((value) => value.trim().toLowerCase())
});

async function sha256(message: string): Promise<string> {
  const encoded = new TextEncoder().encode(message);
  const digest = await crypto.subtle.digest('SHA-256', encoded);
  return fromBytesToHex(new Uint8Array(digest));
}

export async function buildInternalAuthHeader(secret: string, backendAudience: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const payload: ProxyAuthPayload = {
    iss: 'openfinance-proxy',
    aud: backendAudience,
    sub: 'frontend-user',
    jti: crypto.randomUUID(),
    iat: now,
    exp: buildExpiry(now),
    scope: 'proxy:forward'
  };

  const payloadBase64 = toBase64Url(JSON.stringify(payload));
  const signature = await sha256(`${payloadBase64}.${secret}`);
  return `ProxySig ${payloadBase64}.${signature}`;
}

export function validateBearerToken(authorizationHeader: string | null): boolean {
  if (!authorizationHeader) {
    return false;
  }

  return /^Bearer\s+[^\s]+$/i.test(authorizationHeader);
}

function parseJwtPayload(token: string): unknown {
  const parts = token.split('.');
  if (parts.length < 2) {
    return null;
  }

  const payload = parts[1];
  if (!payload) {
    return null;
  }

  try {
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padding = (4 - (normalized.length % 4)) % 4;
    const base64 = normalized + '='.repeat(padding);
    const decoded = atob(base64);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export function isAllowedLoginByBearerToken(authorizationHeader: string | null): boolean {
  if (!validateBearerToken(authorizationHeader)) {
    return false;
  }

  const token = authorizationHeader!.replace(/^Bearer\s+/i, '');
  const payload = parseJwtPayload(token);
  const parsedPayload = jwtPayloadSchema.safeParse(payload);
  if (!parsedPayload.success) {
    return false;
  }

  return allowedLoginEmails.has(parsedPayload.data.email);
}
