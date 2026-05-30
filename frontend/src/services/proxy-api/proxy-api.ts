import type { ProxyRequestConfig } from './proxy-api.types';
import { normalizePath } from './proxy-api.utils';

export function buildProxyUrl(config: ProxyRequestConfig): string {
  const baseUrl = import.meta.env.VITE_PROXY_BASE_URL ?? '';
  return `${baseUrl}${normalizePath(config.path)}`;
}
