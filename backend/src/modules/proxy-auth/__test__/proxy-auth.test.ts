import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { validateProxySignature } from '../proxy-auth.js';

function toBase64Url(value: string): string {
  return Buffer.from(value).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function sign(payloadBase64: string, secret: string): string {
  return createHash('sha256').update(`${payloadBase64}.${secret}`).digest('hex');
}

describe('proxy-auth', () => {
  it('valida assinatura e claims', () => {
    const now = Math.floor(Date.now() / 1000);
    const payload = toBase64Url(
      JSON.stringify({
        iss: 'openfinance-proxy',
        aud: 'http://localhost:3002',
        sub: 'frontend-user',
        jti: 'id-1',
        iat: now,
        exp: now + 60,
        scope: 'proxy:forward'
      })
    );
    const header = `ProxySig ${payload}.${sign(payload, 'dev-secret-123')}`;
    expect(validateProxySignature(header, 'dev-secret-123', 'http://localhost:3002')).toBe(true);
  });
});
