import { buildInternalAuthHeader, validateBearerToken } from '../auth/proxy-auth';
import { forwardRequest } from '../routing/forward';
import { resolveRoute } from '../routing/route-map.utils';
import {
  badGatewayResponse,
  forbiddenResponse,
  notFoundResponse,
  unauthorizedResponse
} from '../shared/http';
import { buildCorrelationId, parseEnv } from '../shared/http.utils';
import { isAllowedOrigin } from './worker.utils';
import type { WorkerHandler } from './worker.types';

const worker: WorkerHandler = {
  async fetch(request, env) {
    const correlationId = buildCorrelationId();
    const parsedEnv = parseEnv(env);
    const url = new URL(request.url);
    const matchedRoute = resolveRoute(request.method, url.pathname);
    const isGoogleAuthRoute =
      url.pathname === '/auth/google/start' || url.pathname === '/auth/google/callback';
    const isPublicAsset = url.pathname === '/favicon.ico';
    const isPublicRoute = isGoogleAuthRoute || isPublicAsset;
    const allowsMissingOrigin = isPublicRoute;

    const origin = request.headers.get('origin');
    const isAllowed = origin
      ? isAllowedOrigin(origin, parsedEnv.PROXY_ALLOWED_ORIGINS)
      : allowsMissingOrigin;

    if (request.method === 'OPTIONS') {
      if (!isAllowed) {
        return withCors(forbiddenResponse(correlationId, 'Origin not allowed'), origin);
      }

      return withCors(new Response(null, { status: 204 }), origin);
    }

    if (!isAllowed) {
      return withCors(forbiddenResponse(correlationId, 'Origin not allowed'), origin);
    }

    if (!matchedRoute && !isPublicAsset) {
      return withCors(notFoundResponse(correlationId), origin);
    }

    if (!isPublicRoute && !validateBearerToken(request.headers.get('authorization'))) {
      return withCors(unauthorizedResponse(correlationId), origin);
    }

    try {
      const upstreamUrl = matchedRoute ? parsedEnv[matchedRoute.upstreamEnvKey] : null;
      if (!upstreamUrl && !isPublicAsset) {
        return withCors(notFoundResponse(correlationId), origin);
      }
      const internalAuthHeader = await buildInternalAuthHeader(parsedEnv.PROXY_SIGNING_SECRET, upstreamUrl!);

      const upstream = await forwardRequest(request, {
        upstreamUrl: upstreamUrl ?? request.url,
        internalAuthHeader,
        correlationId
      });
      return withCors(upstream, origin);
    } catch {
      return withCors(badGatewayResponse(correlationId), origin);
    }
  }
};

export default worker;

function withCors(response: Response, origin: string | null): Response {
  const headers = new Headers(response.headers);
  headers.set('access-control-allow-methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  headers.set('access-control-allow-headers', 'authorization,content-type');
  headers.set('access-control-max-age', '86400');
  if (origin) {
    headers.set('access-control-allow-origin', origin);
    headers.append('vary', 'origin');
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}
