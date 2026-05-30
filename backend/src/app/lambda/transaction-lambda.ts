import type { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2 } from 'aws-lambda';

import { transactionRepository } from '../../infra/database/turso/repositories/transaction-repository.js';
import { getTransactionById, listTransaction } from '../../modules/transaction/transaction.js';
import { transactionIdSchema } from '../../modules/transaction/transaction.utils.js';
import { toLambdaJson } from '../shared/http-response.js';

function extractTransactionId(path: string): string | null {
  const segments = path.split('/').filter(Boolean);
  if (segments.length === 2 && segments[0] === 'transaction') {
    return segments[1] ?? null;
  }

  return null;
}

export async function handler(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyStructuredResultV2> {
  const method = event.requestContext.http.method;
  const path = event.requestContext.http.path;

  if (method === 'GET' && path === '/transaction') {
    const payload = await listTransaction(transactionRepository);
    return toLambdaJson(200, payload);
  }

  if (method === 'GET') {
    const rawId = extractTransactionId(path);
    if (!rawId) return toLambdaJson(404, { error: 'Not found' });

    try {
      const id = transactionIdSchema.parse(rawId);
      const payload = await getTransactionById(transactionRepository, id);
      if (!payload) return toLambdaJson(404, { error: 'Transaction not found' });
      return toLambdaJson(200, payload);
    } catch {
      return toLambdaJson(400, { error: 'Invalid request input' });
    }
  }

  return toLambdaJson(404, { error: 'Not found' });
}
