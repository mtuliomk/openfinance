import type { ProxyAuthPayload } from './proxy-auth.types';
import { buildExpiry, fromBytesToHex, toBase64Url } from './proxy-auth.utils';

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
