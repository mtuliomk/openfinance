export interface ProxyAuthPayload {
  iss: 'openfinance-proxy';
  aud: string;
  sub: string;
  jti: string;
  iat: number;
  exp: number;
  scope: 'proxy:forward';
}
