import { exchangeGoogleCallback } from '../../services/auth-google/auth-google';
import { buildCallbackResult, getCallbackParams } from './auth-callback.utils';
import type { AuthCallbackResult } from './auth-callback.types';

export async function handleGoogleAuthCallback(search: string): Promise<AuthCallbackResult> {
  const params = getCallbackParams(search);
  const callbackSuccess = params.get('success');
  const displayName = params.get('name');
  const avatarUrl = params.get('avatar');
  const email = params.get('email');

  console.info('[auth-callback] params', {
    success: callbackSuccess,
    name: displayName,
    avatar: avatarUrl,
  });

  if (callbackSuccess === '1') {
    return buildCallbackResult(true, null, displayName, avatarUrl, email);
  }

  const code = params.get('code');
  const state = params.get('state');

  if (!code || !state) {
    return buildCallbackResult(false, 'Parâmetros de autenticação ausentes.', null, null, null);
  }

  try {
    await exchangeGoogleCallback({ code, state });
    return buildCallbackResult(true, null, null, null, null);
  } catch {
    return buildCallbackResult(false, 'Não foi possível autenticar com Google.', null, null, null);
  }
}
