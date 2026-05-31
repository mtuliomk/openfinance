import type { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2 } from 'aws-lambda';

import { buildGoogleAuthorizeUrl } from '../../modules/auth-google/auth-google.js';
import { googleStartQuerySchema } from '../../modules/auth-google/auth-google.utils.js';
import { toLambdaJson } from '../shared/http-response.js';

export async function handler(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyStructuredResultV2> {
  if (event.requestContext.http.method !== 'GET') {
    return toLambdaJson(404, { error: 'Not found' });
  }

  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI;
    const frontendCallbackUrl = process.env.FRONTEND_CALLBACK_URL ?? 'http://localhost:3000/auth/callback';

    if (!clientId || !redirectUri) {
      return toLambdaJson(500, { error: 'Google OAuth not configured' });
    }

    const { returnTo } = googleStartQuerySchema.parse({
      returnTo: event.queryStringParameters?.returnTo
    });

    const { url: authorizeUrl, state } = buildGoogleAuthorizeUrl({
      returnTo,
      clientId,
      redirectUri,
      frontendCallbackUrl
    });

    return {
      statusCode: 302,
      headers: { location: authorizeUrl },
      cookies: [`google_oauth_state=${state}; HttpOnly; Path=/; SameSite=Lax; Max-Age=600`]
    };
  } catch {
    return toLambdaJson(400, { error: 'Invalid request input' });
  }
}
