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

    if (!isAllowedOrigin(request.headers.get('origin'), parsedEnv.PROXY_ALLOWED_ORIGINS)) {
      return forbiddenResponse(correlationId, 'Origin not allowed');
    }

    if (!validateBearerToken(request.headers.get('authorization'))) {
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
