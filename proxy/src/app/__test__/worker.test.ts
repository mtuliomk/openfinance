import { describe, expect, it, vi } from 'vitest';
import worker from '../worker';

const env = {
  BACKEND_BASE_URL: 'http://localhost:3001',
  PROXY_SIGNING_SECRET: 'dev-secret-123',
  PROXY_ALLOWED_ORIGINS: 'http://localhost:3000'
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
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { 'content-type': 'application/json' }
        })
      )
    );

    const request = new Request('http://localhost:8787/health', {
      headers: {
        origin: 'http://localhost:3000',
        authorization: 'Bearer token'
      }
    });

    const response = await worker.fetch(request, env);
    expect(response.status).toBe(200);

    vi.unstubAllGlobals();
  });
});
