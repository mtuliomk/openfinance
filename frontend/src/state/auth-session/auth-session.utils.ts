import type { AuthSessionState, PersistedAuthSession } from './auth-session.types';
import { AUTH_SESSION_STORAGE_KEY } from './auth-session.types';

export const initialAuthSessionState: AuthSessionState = {
  status: 'idle',
  errorMessage: null,
};

export function getAuthStorageKey(): string {
  return AUTH_SESSION_STORAGE_KEY;
}

export function toPersistedAuthSession(isAuthenticated: boolean): PersistedAuthSession {
  return { isAuthenticated };
}
