import { createHash } from 'node:crypto';
import type { ProxyTokenPayload } from './proxy-auth.types.js';
import { fromBase64Url, proxyPayloadSchema } from './proxy-auth.utils.js';

function sha256(message: string): string {
  return createHash('sha256').update(message).digest('hex');
}

export function validateProxySignature(headerValue: string | undefined, secret: string, audience: string): boolean {
  if (!headerValue || !headerValue.startsWith('ProxySig ')) {
    return false;
  }

  const token = headerValue.replace('ProxySig ', '');
  const [payloadBase64, signature] = token.split('.');

  if (!payloadBase64 || !signature) {
    return false;
  }

  if (sha256(`${payloadBase64}.${secret}`) !== signature) {
    return false;
  }

  try {
    const payload = proxyPayloadSchema.parse(JSON.parse(fromBase64Url(payloadBase64))) as ProxyTokenPayload;
    const now = Math.floor(Date.now() / 1000);
    return (
      payload.iss === 'openfinance-proxy' &&
      payload.aud === audience &&
      payload.scope === 'proxy:forward' &&
      payload.exp > now
    );
  } catch {
    return false;
  }
}
