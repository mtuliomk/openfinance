import { describe, expect, it } from 'vitest';
import { resolveRoute } from '../route-map.utils';

describe('route-map.utils', () => {
  it('resolve rota existente por método e path', () => {
    const route = resolveRoute('GET', '/health');
    expect(route).not.toBeNull();
    expect(route?.upstreamEnvKey).toBe('LAMBDA_HEALTH_URL');
  });

  it('retorna null para rota inexistente', () => {
    const route = resolveRoute('GET', '/unknown');
    expect(route).toBeNull();
  });
});
