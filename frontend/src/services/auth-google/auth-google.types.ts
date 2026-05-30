export interface GoogleAuthStartParams {
  returnTo?: string;
}

export interface GoogleAuthCallbackParams {
  code: string;
  state: string;
}
