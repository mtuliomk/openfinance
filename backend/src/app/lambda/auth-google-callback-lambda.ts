import type { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2 } from 'aws-lambda';

import { exchangeGoogleCode } from '../../modules/auth-google/auth-google.js';
import { googleCallbackQuerySchema } from '../../modules/auth-google/auth-google.utils.js';
import { toLambdaJson } from '../shared/http-response.js';

type OAuthState = {
  nonce: string;
  returnTo: string;
  frontendCallbackUrl: string;
};

function getCookieValue(cookieHeader: string | undefined, name: string): string | null {
  if (!cookieHeader) return null;

  const cookie = cookieHeader
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));

  if (!cookie) return null;
  return cookie.split('=')[1] ?? null;
}

export async function handler(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyStructuredResultV2> {
  if (event.requestContext.http.method !== 'GET' || event.requestContext.http.path !== '/auth/google/callback') {
    return toLambdaJson(404, { error: 'Not found' });
  }

  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI;

    if (!clientId || !clientSecret || !redirectUri) {
      return toLambdaJson(500, { error: 'Google OAuth not configured' });
    }

    const parsed = googleCallbackQuerySchema.parse({
      code: event.queryStringParameters?.code,
      state: event.queryStringParameters?.state
    });

    const stateCookie = getCookieValue(event.headers.cookie, 'google_oauth_state');

    let decodedState: OAuthState | null = null;
    try {
      decodedState = JSON.parse(Buffer.from(parsed.state, 'base64url').toString('utf-8')) as OAuthState;
    } catch {
      decodedState = null;
    }

    if (!stateCookie || !decodedState || stateCookie !== decodedState.nonce) {
      return toLambdaJson(401, { error: 'Invalid oauth state' });
    }

    const user = await exchangeGoogleCode({
      code: parsed.code,
      state: parsed.state,
      clientId,
      clientSecret,
      redirectUri
    });

    const callbackUrl = new URL(decodedState.returnTo, decodedState.frontendCallbackUrl);
    callbackUrl.searchParams.set('success', '1');
    callbackUrl.searchParams.set('name', user.name);
    callbackUrl.searchParams.set('avatar', user.picture);

    return {
      statusCode: 302,
      headers: { location: callbackUrl.toString() },
      cookies: [
        'google_oauth_state=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0',
        `session_user=${Buffer.from(JSON.stringify(user)).toString('base64')}; HttpOnly; Path=/; SameSite=Lax; Max-Age=86400`
      ]
    };
  } catch {
    return toLambdaJson(400, { error: 'Unable to authenticate with Google' });
  }
}
