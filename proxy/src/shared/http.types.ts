export interface Env {
  BACKEND_BASE_URL: string;
  PROXY_SIGNING_SECRET: string;
  PROXY_ALLOWED_ORIGINS: string;
}

export interface ErrorBody {
  error: string;
  correlationId: string;
}
