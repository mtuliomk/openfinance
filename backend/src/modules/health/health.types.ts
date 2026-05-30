export const HEALTH_STATUS = 'ok' as const;

export type HealthStatus = typeof HEALTH_STATUS;

export interface HealthResponse {
  status: HealthStatus;
  timestamp: string;
}
