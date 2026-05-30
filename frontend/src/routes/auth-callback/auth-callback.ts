import { exchangeGoogleCallback } from '../../services/auth-google/auth-google';
import { buildCallbackResult, getCallbackParams } from './auth-callback.utils';
import type { AuthCallbackResult } from './auth-callback.types';

export async function handleGoogleAuthCallback(search: string): Promise<AuthCallbackResult> {
  const params = getCallbackParams(search);
  const callbackSuccess = params.get('success');

  if (callbackSuccess === '1') {
    return buildCallbackResult(true, null);
  }

  const code = params.get('code');
  const state = params.get('state');

  if (!code || !state) {
    return buildCallbackResult(false, 'Parâmetros de autenticação ausentes.');
  }

  try {
    await exchangeGoogleCallback({ code, state });
    return buildCallbackResult(true, null);
  } catch {
    return buildCallbackResult(false, 'Não foi possível autenticar com Google.');
  }
}
