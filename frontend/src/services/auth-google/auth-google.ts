import { buildProxyUrl } from '../proxy-api/proxy-api';
import { startNetworkLoading } from '../../state/network-loading/network-loading';
import type { GoogleAuthCallbackParams, GoogleAuthStartParams } from './auth-google.types';
import { AUTH_GOOGLE_CALLBACK_PATH, AUTH_GOOGLE_START_PATH } from './auth-google.utils';

export function getGoogleAuthStartUrl(params: GoogleAuthStartParams = {}): string {
  const url = new URL(buildProxyUrl({ path: AUTH_GOOGLE_START_PATH }), window.location.origin);

  if (params.returnTo) {
    url.searchParams.set('returnTo', params.returnTo);
  }

  return url.toString();
}

export async function exchangeGoogleCallback(params: GoogleAuthCallbackParams): Promise<void> {
  const url = new URL(buildProxyUrl({ path: AUTH_GOOGLE_CALLBACK_PATH }), window.location.origin);
  url.searchParams.set('code', params.code);
  url.searchParams.set('state', params.state);

  const stopNetworkLoading = startNetworkLoading();

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Falha ao concluir autenticação com Google.');
    }
  } finally {
    stopNetworkLoading();
  }
}
