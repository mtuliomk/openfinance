import { ROUTE_MAP } from './route-map';
import type { RouteMapEntry } from './route-map.types';

export function resolveRoute(method: string, path: string): RouteMapEntry | null {
  const normalizedMethod = method.toUpperCase();
  const route = ROUTE_MAP.find((entry) => entry.method === normalizedMethod && entry.path === path);
  return route ?? null;
}
