import type { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2 } from 'aws-lambda';

import { itemsRepository } from '../../infra/database/turso/repositories/items-repository.js';
import { getItemById, listItems, updateItemById } from '../../modules/items/items.js';
import { itemIdSchema, itemUpdateSchema } from '../../modules/items/items.utils.js';
import { toLambdaJson } from '../shared/http-response.js';

function extractItemId(path: string): string | null {
  const segments = path.split('/').filter(Boolean);
  if (segments.length === 2 && segments[0] === 'items') {
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
    const rawId = extractItemId(path);

    if (!rawId) {
      const payload = await listItems(itemsRepository);
      return toLambdaJson(200, payload);
    }

    try {
      const id = itemIdSchema.parse(rawId);
      const payload = await getItemById(itemsRepository, id);

      if (!payload) {
        return toLambdaJson(404, { error: 'Item not found' });
      }

      return toLambdaJson(200, payload);
    } catch {
      return toLambdaJson(400, { error: 'Invalid request input' });
    }
  }

  if (method === 'PUT') {
    const rawId = extractItemId(path);

    if (!rawId) {
      return toLambdaJson(404, { error: 'Not found' });
    }

    try {
      const id = itemIdSchema.parse(rawId);
      const parsedBody = JSON.parse(event.body ?? '{}') as unknown;
      const input = itemUpdateSchema.parse(parsedBody);
      const payload = await updateItemById(itemsRepository, id, input);

      if (!payload) {
        return toLambdaJson(404, { error: 'Item not found' });
      }

      return toLambdaJson(200, payload);
    } catch {
      return toLambdaJson(400, { error: 'Invalid request input' });
    }
  }

  return toLambdaJson(404, { error: 'Not found' });
}
