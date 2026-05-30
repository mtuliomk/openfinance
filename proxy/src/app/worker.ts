import { buildInternalAuthHeader, validateBearerToken } from '../auth/proxy-auth';
import { forwardRequest } from '../routing/forward';
import { badGatewayResponse, forbiddenResponse, unauthorizedResponse } from '../shared/http';
import { buildCorrelationId, parseEnv } from '../shared/http.utils';
import { isAllowedOrigin } from './worker.utils';
import type { WorkerHandler } from './worker.types';

const worker: WorkerHandler = {
  async fetch(request, env) {
    const correlationId = buildCorrelationId();
    const parsedEnv = parseEnv(env);
    const url = new URL(request.url);
    const isGoogleAuthRoute =
      url.pathname === '/auth/google/start' || url.pathname === '/auth/google/callback';
    const isPublicAsset = url.pathname === '/favicon.ico';
    const isPublicRoute = isGoogleAuthRoute || isPublicAsset;
    const allowsMissingOrigin = isPublicRoute;

    const origin = request.headers.get('origin');
    const isAllowed = origin
      ? isAllowedOrigin(origin, parsedEnv.PROXY_ALLOWED_ORIGINS)
      : allowsMissingOrigin;
    if (!isAllowed) {
      return forbiddenResponse(correlationId, 'Origin not allowed');
    }

    if (!isPublicRoute && !validateBearerToken(request.headers.get('authorization'))) {
      return unauthorizedResponse(correlationId);
    }

    try {
      const internalAuthHeader = await buildInternalAuthHeader(
        parsedEnv.PROXY_SIGNING_SECRET,
        parsedEnv.BACKEND_BASE_URL
      );

      return await forwardRequest(request, {
        backendBaseUrl: parsedEnv.BACKEND_BASE_URL,
        internalAuthHeader,
        correlationId
      });
    } catch {
      return badGatewayResponse(correlationId);
    }
  }
};

export default worker;
