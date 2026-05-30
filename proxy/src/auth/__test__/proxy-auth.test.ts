import { describe, expect, it } from 'vitest';
import { buildInternalAuthHeader, validateBearerToken } from '../proxy-auth';

describe('proxy-auth', () => {
  it('valida bearer token estrutural', () => {
    expect(validateBearerToken('Bearer abc')).toBe(true);
    expect(validateBearerToken('Basic abc')).toBe(false);
    expect(validateBearerToken(null)).toBe(false);
  });

  it('gera header interno assinado', async () => {
    const value = await buildInternalAuthHeader('dev-secret-123', 'http://localhost:3001');
    expect(value.startsWith('ProxySig ')).toBe(true);
  });
});
