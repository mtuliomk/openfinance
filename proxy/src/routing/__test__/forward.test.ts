import { describe, expect, it } from 'vitest';
import { buildForwardUrl } from '../forward.utils';

describe('forward.utils', () => {
  it('preserva query ao montar url de destino', () => {
    const url = buildForwardUrl('http://localhost:3001/account', 'http://localhost:8787/qualquer?limit=10');
    expect(url).toBe('http://localhost:3001/account?limit=10');
  });
});
