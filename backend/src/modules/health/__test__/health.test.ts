import { describe, expect, it } from 'vitest';

import { getHealthFromQuery } from '../health.js';

describe('getHealthFromQuery', () => {
  it('returns success payload', () => {
    const response = getHealthFromQuery(new URLSearchParams());

    expect(response.status).toBe('ok');
    expect(response.timestamp).toBeTruthy();
  });

  it('rejects invalid query values', () => {
    expect(() => getHealthFromQuery(new URLSearchParams('includeTimestamp=invalid'))).toThrow();
  });
});
