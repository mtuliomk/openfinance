import type { Env } from '../shared/http.types';

export interface WorkerHandler {
  fetch(request: Request, env: Env): Promise<Response>;
}
