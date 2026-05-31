import type { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2 } from 'aws-lambda';

import { getHealthFromQuery } from '../../modules/health/health.js';
import { toLambdaJson } from '../shared/http-response.js';

export async function handler(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyStructuredResultV2> {
  if (event.requestContext.http.method !== 'GET') {
    return toLambdaJson(404, { error: 'Not found' });
  }

  try {
    const rawQuery = new URLSearchParams(event.rawQueryString ?? '');
    const payload = getHealthFromQuery(rawQuery);
    return toLambdaJson(200, payload);
  } catch {
    return toLambdaJson(400, { error: 'Invalid request input' });
  }
}
