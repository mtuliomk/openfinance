import { describe, expect, it, vi } from 'vitest';
import worker from '../worker';

const env = {
  PROXY_SIGNING_SECRET: 'dev-secret-123',
  PROXY_ALLOWED_ORIGINS: 'http://localhost:3000',
  LAMBDA_HEALTH_URL: 'http://localhost:3001/health',
  LAMBDA_AUTH_GOOGLE_START_URL: 'http://localhost:3002/auth/google/start',
  LAMBDA_AUTH_GOOGLE_CALLBACK_URL: 'http://localhost:3003/auth/google/callback',
  LAMBDA_CONSENT_URL: 'http://localhost:3004/consent',
  LAMBDA_ACCOUNT_URL: 'http://localhost:3005/account',
  LAMBDA_TRANSACTION_URL: 'http://localhost:3006/transaction',
  LAMBDA_INVESTMENT_URL: 'http://localhost:3007/investment',
  LAMBDA_LOAN_URL: 'http://localhost:3008/loan',
  LAMBDA_BILL_URL: 'http://localhost:3009/bill',
  LAMBDA_IDENTITY_URL: 'http://localhost:3010/identity',
  LAMBDA_ITEMS_URL: 'http://localhost:3011/items',
  LAMBDA_OPENFINANCE_RELOAD_URL: 'http://localhost:3012/openfinance/reload'
};

describe('worker', () => {
  it('retorna 403 para origin não permitida', async () => {
    const request = new Request('http://localhost:8787/health', {
      headers: {
        origin: 'http://malicious.local',
        authorization: 'Bearer token'
      }
    });

    const response = await worker.fetch(request, env);
    expect(response.status).toBe(403);
  });

  it('retorna 404 para rota não mapeada', async () => {
    const request = new Request('http://localhost:8787/rota-inexistente', {
      headers: {
        origin: 'http://localhost:3000',
        authorization: 'Bearer token'
      }
    });

    const response = await worker.fetch(request, env);
    expect(response.status).toBe(404);
  });

  it('retorna 401 sem bearer token', async () => {
    const request = new Request('http://localhost:8787/health', {
      headers: {
        origin: 'http://localhost:3000'
      }
    });

    const response = await worker.fetch(request, env);
    expect(response.status).toBe(401);
  });

  it('encaminha para backend quando válido', async () => {
    const fetchMock = vi.fn(async () =>
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'content-type': 'application/json' }
      })
    );
    vi.stubGlobal('fetch', fetchMock);

    const request = new Request('http://localhost:8787/health?x=1', {
      headers: {
        origin: 'http://localhost:3000',
        authorization: 'Bearer token'
      }
    });

    const response = await worker.fetch(request, env);
    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const calls = fetchMock.mock.calls as unknown as Array<[string, RequestInit]>;
    const firstCall = calls[0];
    expect(firstCall).toBeDefined();
    const forwardUrl = firstCall?.[0];
    const forwardInit = firstCall?.[1];
    expect(forwardUrl).toBe('http://localhost:3001/health?x=1');
    expect(forwardInit?.method).toBe('GET');

    vi.unstubAllGlobals();
  });
});
