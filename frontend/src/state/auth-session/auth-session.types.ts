export interface AuthSessionState {
  status: 'idle' | 'loading' | 'authenticated' | 'error';
  errorMessage: string | null;
}

export const AUTH_SESSION_STORAGE_KEY = 'openfinance.auth.session';

export interface PersistedAuthSession {
  isAuthenticated: boolean;
}
