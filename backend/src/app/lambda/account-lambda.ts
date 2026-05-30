import type { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2 } from 'aws-lambda';

import { accountRepository } from '../../infra/database/turso/repositories/account-repository.js';
import {
  createAccount,
  deleteAccountById,
  getAccountById,
  listAccount,
  updateAccountById
} from '../../modules/account/account.js';
import {
  accountCreateSchema,
  accountIdSchema,
  accountUpdateSchema
} from '../../modules/account/account.utils.js';
import { toLambdaJson } from '../shared/http-response.js';

function extractAccountId(path: string): string | null {
  const segments = path.split('/').filter(Boolean);
  if (segments.length === 2 && segments[0] === 'account') {
    return segments[1] ?? null;
  }

  return null;
}

export async function handler(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyStructuredResultV2> {
  const method = event.requestContext.http.method;
  const path = event.requestContext.http.path;

  if (method === 'POST' && path === '/account') {
    try {
      const parsedBody = JSON.parse(event.body ?? '{}') as unknown;
      const input = accountCreateSchema.parse(parsedBody);
      const payload = await createAccount(accountRepository, input);
      return toLambdaJson(201, payload);
    } catch {
      return toLambdaJson(400, { error: 'Invalid request input' });
    }
  }

  if (method === 'GET' && path === '/account') {
    const payload = await listAccount(accountRepository);
    return toLambdaJson(200, payload);
  }

  if (method === 'GET') {
    const rawId = extractAccountId(path);
    if (!rawId) return toLambdaJson(404, { error: 'Not found' });

    try {
      const id = accountIdSchema.parse(rawId);
      const payload = await getAccountById(accountRepository, id);
      if (!payload) return toLambdaJson(404, { error: 'Account not found' });
      return toLambdaJson(200, payload);
    } catch {
      return toLambdaJson(400, { error: 'Invalid request input' });
    }
  }

  if (method === 'PUT') {
    const rawId = extractAccountId(path);
    if (!rawId) return toLambdaJson(404, { error: 'Not found' });

    try {
      const id = accountIdSchema.parse(rawId);
      const parsedBody = JSON.parse(event.body ?? '{}') as unknown;
      const input = accountUpdateSchema.parse(parsedBody);
      const payload = await updateAccountById(accountRepository, id, input);
      if (!payload) return toLambdaJson(404, { error: 'Account not found' });
      return toLambdaJson(200, payload);
    } catch {
      return toLambdaJson(400, { error: 'Invalid request input' });
    }
  }

  if (method === 'DELETE') {
    const rawId = extractAccountId(path);
    if (!rawId) return toLambdaJson(404, { error: 'Not found' });

    try {
      const id = accountIdSchema.parse(rawId);
      const deleted = await deleteAccountById(accountRepository, id);
      if (!deleted) return toLambdaJson(404, { error: 'Account not found' });
      return toLambdaJson(204, null);
    } catch {
      return toLambdaJson(400, { error: 'Invalid request input' });
    }
  }

  return toLambdaJson(404, { error: 'Not found' });
}
