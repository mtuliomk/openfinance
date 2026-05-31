export interface ProxyAuthPayload {
  iss: 'openfinance-proxy';
  aud: string;
  sub: string;
  jti: string;
  iat: number;
  exp: number;
  scope: 'proxy:forward';
}

export const ALLOWED_LOGIN_EMAILS: readonly string[] = [
  'mtuliomk@gmail.com',
  'omayumirk@gmail.com'
];
