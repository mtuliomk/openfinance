export interface Env {
  PROXY_SIGNING_SECRET: string;
  PROXY_ALLOWED_ORIGINS: string;
  LAMBDA_HEALTH_URL: string;
  LAMBDA_AUTH_GOOGLE_START_URL: string;
  LAMBDA_AUTH_GOOGLE_CALLBACK_URL: string;
  LAMBDA_CONSENT_URL: string;
  LAMBDA_ACCOUNT_URL: string;
  LAMBDA_TRANSACTION_URL: string;
  LAMBDA_INVESTMENT_URL: string;
  LAMBDA_LOAN_URL: string;
  LAMBDA_BILL_URL: string;
  LAMBDA_IDENTITY_URL: string;
  LAMBDA_ITEMS_URL: string;
  LAMBDA_OPENFINANCE_RELOAD_URL: string;
}

export interface ErrorBody {
  error: string;
  correlationId: string;
}
