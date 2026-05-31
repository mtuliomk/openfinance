import type { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2 } from 'aws-lambda';

import { consentRepository } from '../../infra/database/turso/repositories/consent-repository.js';
import { getConsentById, listConsent } from '../../modules/consent/consent.js';
import { consentIdSchema } from '../../modules/consent/consent.utils.js';
import { toLambdaJson } from '../shared/http-response.js';

function extractConsentId(path: string): string | null {
  const segments = path.split('/').filter(Boolean);
  if (segments.length === 2 && segments[0] === 'consent') {
    return segments[1] ?? null;
  }

  return null;
}

export async function handler(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyStructuredResultV2> {
  const method = event.requestContext.http.method;
  const path = event.requestContext.http.path;

  if (method === 'GET' && path === '/consent') {
    const payload = await listConsent(consentRepository);
    return toLambdaJson(200, payload);
  }

  if (method === 'GET') {
    const rawId = extractConsentId(path);
    if (!rawId) return toLambdaJson(404, { error: 'Not found' });

    try {
      const id = consentIdSchema.parse(rawId);
      const payload = await getConsentById(consentRepository, id);
      if (!payload) return toLambdaJson(404, { error: 'Consent not found' });
      return toLambdaJson(200, payload);
    } catch {
      return toLambdaJson(400, { error: 'Invalid request input' });
    }
  }

  return toLambdaJson(404, { error: 'Not found' });
}
