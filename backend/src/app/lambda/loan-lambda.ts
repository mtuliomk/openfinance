import type { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2 } from 'aws-lambda';

import { loanRepository } from '../../infra/database/turso/repositories/loan-repository.js';
import { getLoanById, listLoan } from '../../modules/loan/loan.js';
import { loanIdSchema } from '../../modules/loan/loan.utils.js';
import { toLambdaJson } from '../shared/http-response.js';

function extractLoanId(path: string): string | null {
  const segments = path.split('/').filter(Boolean);
  if (segments.length === 2 && segments[0] === 'loan') {
    return segments[1] ?? null;
  }

  return null;
}

export async function handler(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyStructuredResultV2> {
  const method = event.requestContext.http.method;
  const path = event.requestContext.http.path;

  if (method === 'GET' && path === '/loan') {
    const payload = await listLoan(loanRepository);
    return toLambdaJson(200, payload);
  }

  if (method === 'GET') {
    const rawId = extractLoanId(path);
    if (!rawId) return toLambdaJson(404, { error: 'Not found' });

    try {
      const id = loanIdSchema.parse(rawId);
      const payload = await getLoanById(loanRepository, id);
      if (!payload) return toLambdaJson(404, { error: 'Loan not found' });
      return toLambdaJson(200, payload);
    } catch {
      return toLambdaJson(400, { error: 'Invalid request input' });
    }
  }

  return toLambdaJson(404, { error: 'Not found' });
}
