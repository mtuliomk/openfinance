import type { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2 } from 'aws-lambda';

import { identityRepository } from '../../infra/database/turso/repositories/identity-repository.js';
import { getIdentityById, listIdentity } from '../../modules/identity/identity.js';
import { identityIdSchema } from '../../modules/identity/identity.utils.js';
import { toLambdaJson } from '../shared/http-response.js';

function extractIdentityId(path: string): string | null {
  const segments = path.split('/').filter(Boolean);
  if (segments.length === 2 && segments[0] === 'identity') {
    return segments[1] ?? null;
  }

  return null;
}

export async function handler(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyStructuredResultV2> {
  const method = event.requestContext.http.method;
  const path = event.requestContext.http.path;
  if (method === 'GET') {
    const rawId = extractIdentityId(path);

    if (!rawId) {
      const payload = await listIdentity(identityRepository);
      return toLambdaJson(200, payload);
    }
    try {
      const id = identityIdSchema.parse(rawId);
      const payload = await getIdentityById(identityRepository, id);
      if (!payload) return toLambdaJson(404, { error: 'Identity not found' });
      return toLambdaJson(200, payload);
    } catch {
      return toLambdaJson(400, { error: 'Invalid request input' });
    }
  }

  return toLambdaJson(404, { error: 'Not found' });
}
