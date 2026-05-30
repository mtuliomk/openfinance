import { describe, expect, it } from 'vitest';
import { buildForwardUrl } from '../forward.utils';

describe('forward.utils', () => {
  it('preserva path e query ao montar url de destino', () => {
    const url = buildForwardUrl('http://localhost:3001', 'http://localhost:8787/items?limit=10');
    expect(url).toBe('http://localhost:3001/items?limit=10');
  });
});
