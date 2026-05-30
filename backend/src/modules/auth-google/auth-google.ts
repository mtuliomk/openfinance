import type { GoogleCallbackInput, GoogleStartInput, GoogleUserProfile } from './auth-google.types.js';
import { buildStateToken } from './auth-google.utils.js';

export function buildGoogleAuthorizeUrl(input: GoogleStartInput): { url: string; state: string } {
  const state = buildStateToken();
  const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  const oauthState = Buffer.from(
    JSON.stringify({
      nonce: state,
      returnTo: input.returnTo,
      frontendCallbackUrl: input.frontendCallbackUrl
    })
  ).toString('base64url');
  url.searchParams.set('client_id', input.clientId);
  url.searchParams.set('redirect_uri', input.redirectUri);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('scope', 'openid email profile');
  url.searchParams.set('state', oauthState);
  url.searchParams.set('prompt', 'select_account');
  url.searchParams.set('access_type', 'offline');
  url.searchParams.set('include_granted_scopes', 'true');
  return { url: url.toString(), state };
}

export async function exchangeGoogleCode(input: GoogleCallbackInput): Promise<GoogleUserProfile> {
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code: input.code,
      client_id: input.clientId,
      client_secret: input.clientSecret,
      redirect_uri: input.redirectUri,
      grant_type: 'authorization_code'
    })
  });

  if (!tokenResponse.ok) {
    throw new Error('Failed token exchange');
  }

  const tokenData = (await tokenResponse.json()) as { id_token?: string };
  if (!tokenData.id_token) {
    throw new Error('Missing id_token');
  }

  const verifyResponse = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${tokenData.id_token}`);
  if (!verifyResponse.ok) {
    throw new Error('Failed token verification');
  }

  const verifyData = (await verifyResponse.json()) as Record<string, string | undefined>;
  if (verifyData.aud !== input.clientId) {
    throw new Error('Invalid token audience');
  }

  return {
    email: verifyData.email ?? '',
    name: verifyData.name ?? '',
    picture: verifyData.picture ?? '',
    sub: verifyData.sub ?? ''
  };
}
