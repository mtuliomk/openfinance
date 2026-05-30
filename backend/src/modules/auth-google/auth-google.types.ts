export interface GoogleStartInput {
  returnTo: string;
  clientId: string;
  redirectUri: string;
  frontendCallbackUrl: string;
}

export interface GoogleCallbackInput {
  code: string;
  state: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export interface GoogleUserProfile {
  email: string;
  name: string;
  sub: string;
}
