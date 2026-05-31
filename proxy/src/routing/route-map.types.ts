export const HTTP_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] as const;

export type HttpMethod = (typeof HTTP_METHODS)[number];

export interface RouteMapEntry {
  method: HttpMethod;
  path: string;
  upstreamEnvKey: keyof Env;
}
import type { Env } from '../shared/http.types';
