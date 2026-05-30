import type { ForwardConfig } from './forward.types';
import { buildForwardUrl } from './forward.utils';

export async function forwardRequest(request: Request, config: ForwardConfig): Promise<Response> {
  const headers = new Headers(request.headers);
  headers.set('x-proxy-auth', config.internalAuthHeader);
  headers.set('x-correlation-id', config.correlationId);
  headers.delete('host');

  const forwardUrl = buildForwardUrl(config.backendBaseUrl, request.url);
  const init: RequestInit = {
    method: request.method,
    headers
  };

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    init.body = request.body;
  }

  const upstream = await fetch(forwardUrl, init);

  return new Response(upstream.body, {
    status: upstream.status,
    headers: upstream.headers
  });
}
