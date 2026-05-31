import type { ErrorBody } from './http.types';
import { buildJsonResponse } from './http.utils';

export function unauthorizedResponse(correlationId: string, message = 'Unauthorized'): Response {
  const body: ErrorBody = { error: message, correlationId };
  return buildJsonResponse(401, body);
}

export function forbiddenResponse(correlationId: string, message = 'Forbidden'): Response {
  const body: ErrorBody = { error: message, correlationId };
  return buildJsonResponse(403, body);
}

export function badGatewayResponse(correlationId: string): Response {
  const body: ErrorBody = { error: 'Bad Gateway', correlationId };
  return buildJsonResponse(502, body);
}

export function notFoundResponse(correlationId: string, message = 'Not Found'): Response {
  const body: ErrorBody = { error: message, correlationId };
  return buildJsonResponse(404, body);
}
