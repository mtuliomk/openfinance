import { describe, expect, it, vi } from 'vitest';
import { handleGoogleAuthCallback } from '../auth-callback';
import * as authGoogle from '../../../services/auth-google/auth-google';

describe('handleGoogleAuthCallback', () => {
  it('retorna sucesso quando callback recebe success=1', async () => {
    const result = await handleGoogleAuthCallback('?success=1');
    expect(result).toEqual({ success: true, errorMessage: null });
  });

  it('retorna erro quando faltam params obrigatorios e sem success=1', async () => {
    const result = await handleGoogleAuthCallback('');
    expect(result).toEqual({ success: false, errorMessage: 'Parâmetros de autenticação ausentes.' });
  });

  it('usa exchangeGoogleCallback quando recebe code/state', async () => {
    const exchangeSpy = vi
      .spyOn(authGoogle, 'exchangeGoogleCallback')
      .mockResolvedValue(undefined);

    const result = await handleGoogleAuthCallback('?code=abc&state=xyz');

    expect(exchangeSpy).toHaveBeenCalledWith({ code: 'abc', state: 'xyz' });
    expect(result).toEqual({ success: true, errorMessage: null });

    exchangeSpy.mockRestore();
  });
});
