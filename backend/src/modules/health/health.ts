import { z } from 'zod';

import { HEALTH_STATUS, type HealthResponse } from './health.types.js';
import { toIsoDate } from './health.utils.js';

const healthQuerySchema = z.object({
  includeTimestamp: z.enum(['true', 'false']).optional().default('true')
});

export function getHealthFromQuery(rawQuery: URLSearchParams): HealthResponse {
  const parsed = healthQuerySchema.parse({
    includeTimestamp: rawQuery.get('includeTimestamp') ?? undefined
  });

  return {
    status: HEALTH_STATUS,
    timestamp: parsed.includeTimestamp === 'true' ? toIsoDate(new Date()) : ''
  };
}
