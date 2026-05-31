import type { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2 } from 'aws-lambda';

import { billRepository } from '../../infra/database/turso/repositories/bill-repository.js';
import { getBillById, listBill } from '../../modules/bill/bill.js';
import { billIdSchema } from '../../modules/bill/bill.utils.js';
import { toLambdaJson } from '../shared/http-response.js';

function extractBillId(path: string): string | null {
  const segments = path.split('/').filter(Boolean);
  if (segments.length === 2 && segments[0] === 'bill') {
    return segments[1] ?? null;
  }

  return null;
}

export async function handler(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyStructuredResultV2> {
  const method = event.requestContext.http.method;
  const path = event.requestContext.http.path;

  if (method === 'GET' && path === '/bill') {
    const payload = await listBill(billRepository);
    return toLambdaJson(200, payload);
  }

  if (method === 'GET') {
    const rawId = extractBillId(path);
    if (!rawId) return toLambdaJson(404, { error: 'Not found' });

    try {
      const id = billIdSchema.parse(rawId);
      const payload = await getBillById(billRepository, id);
      if (!payload) return toLambdaJson(404, { error: 'Bill not found' });
      return toLambdaJson(200, payload);
    } catch {
      return toLambdaJson(400, { error: 'Invalid request input' });
    }
  }

  return toLambdaJson(404, { error: 'Not found' });
}
