import { parseAllowedOrigins } from '../shared/http.utils';

export function isAllowedOrigin(origin: string | null, allowedRaw: string): boolean {
  if (!origin) {
    return false;
  }

  const allowed = parseAllowedOrigins(allowedRaw);
  return allowed.includes(origin);
}
