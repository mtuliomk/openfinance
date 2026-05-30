import { getAuthStorageKey, initialAuthSessionState, toPersistedAuthSession } from './auth-session.utils';
import type { AuthSessionState, PersistedAuthSession } from './auth-session.types';

export function getInitialAuthSessionState(): AuthSessionState {
  const persistedSession = readPersistedAuthSession();

  if (persistedSession?.isAuthenticated) {
    return { status: 'authenticated', errorMessage: null };
  }

  return initialAuthSessionState;
}

export function persistAuthenticatedSession(): void {
  window.localStorage.setItem(getAuthStorageKey(), JSON.stringify(toPersistedAuthSession(true)));
}

export function clearPersistedSession(): void {
  window.localStorage.removeItem(getAuthStorageKey());
}

function readPersistedAuthSession(): PersistedAuthSession | null {
  const rawValue = window.localStorage.getItem(getAuthStorageKey());

  if (!rawValue) {
    return null;
  }

  try {
    const parsedValue = JSON.parse(rawValue) as PersistedAuthSession;

    if (typeof parsedValue.isAuthenticated !== 'boolean') {
      return null;
    }

    return parsedValue;
  } catch {
    return null;
  }
}
