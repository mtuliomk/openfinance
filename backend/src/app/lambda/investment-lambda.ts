import type { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2 } from 'aws-lambda';

import { investmentRepository } from '../../infra/database/turso/repositories/investment-repository.js';
import { getInvestmentById, listInvestment } from '../../modules/investment/investment.js';
import { investmentIdSchema } from '../../modules/investment/investment.utils.js';
import { toLambdaJson } from '../shared/http-response.js';

function extractInvestmentId(path: string): string | null {
  const segments = path.split('/').filter(Boolean);
  if (segments.length === 2 && segments[0] === 'investment') {
    return segments[1] ?? null;
  }

  return null;
}

export async function handler(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyStructuredResultV2> {
  const method = event.requestContext.http.method;
  const path = event.requestContext.http.path;

  if (method === 'GET' && path === '/investment') {
    const payload = await listInvestment(investmentRepository);
    return toLambdaJson(200, payload);
  }

  if (method === 'GET') {
    const rawId = extractInvestmentId(path);
    if (!rawId) return toLambdaJson(404, { error: 'Not found' });

    try {
      const id = investmentIdSchema.parse(rawId);
      const payload = await getInvestmentById(investmentRepository, id);
      if (!payload) return toLambdaJson(404, { error: 'Investment not found' });
      return toLambdaJson(200, payload);
    } catch {
      return toLambdaJson(400, { error: 'Invalid request input' });
    }
  }

  return toLambdaJson(404, { error: 'Not found' });
}
