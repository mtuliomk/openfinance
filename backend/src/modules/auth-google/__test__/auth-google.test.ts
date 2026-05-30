import { describe, expect, it } from 'vitest';
import { buildGoogleAuthorizeUrl } from '../auth-google.js';

describe('auth-google', () => {
  it('gera url de autorização com parâmetros obrigatórios', () => {
    const result = buildGoogleAuthorizeUrl({
      returnTo: '/auth/callback',
      clientId: 'client-id',
      redirectUri: 'http://localhost:3002/auth/google/callback',
      frontendCallbackUrl: 'http://localhost:3000/auth/callback'
    });

    expect(result.url).toContain('accounts.google.com');
    expect(result.url).toContain('client_id=client-id');
    expect(result.url).toContain('response_type=code');
    expect(result.state.length).toBeGreaterThan(10);
  });
});
