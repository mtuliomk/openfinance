import type { RouteMapEntry } from './route-map.types';

export const ROUTE_MAP: RouteMapEntry[] = [
  { method: 'GET', path: '/health', upstreamEnvKey: 'LAMBDA_HEALTH_URL' },
  { method: 'GET', path: '/auth/google/start', upstreamEnvKey: 'LAMBDA_AUTH_GOOGLE_START_URL' },
  { method: 'GET', path: '/auth/google/callback', upstreamEnvKey: 'LAMBDA_AUTH_GOOGLE_CALLBACK_URL' },
  { method: 'GET', path: '/consents', upstreamEnvKey: 'LAMBDA_CONSENT_URL' },
  { method: 'GET', path: '/accounts', upstreamEnvKey: 'LAMBDA_ACCOUNT_URL' },
  { method: 'GET', path: '/transactions', upstreamEnvKey: 'LAMBDA_TRANSACTION_URL' },
  { method: 'GET', path: '/investments', upstreamEnvKey: 'LAMBDA_INVESTMENT_URL' },
  { method: 'GET', path: '/loans', upstreamEnvKey: 'LAMBDA_LOAN_URL' },
  { method: 'GET', path: '/bills', upstreamEnvKey: 'LAMBDA_BILL_URL' },
  { method: 'GET', path: '/identity', upstreamEnvKey: 'LAMBDA_IDENTITY_URL' },
  { method: 'GET', path: '/items', upstreamEnvKey: 'LAMBDA_ITEMS_URL' },
  { method: 'POST', path: '/openfinance/reload', upstreamEnvKey: 'LAMBDA_OPENFINANCE_RELOAD_URL' }
];
