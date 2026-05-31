import { getAuthStorageKey, initialAuthSessionState, isValidAvatarUrl, toPersistedAuthSession } from './auth-session.utils';
import type { AuthSessionState, PersistedAuthSession } from './auth-session.types';

export function getInitialAuthSessionState(): AuthSessionState {
  const persistedSession = readPersistedAuthSession();

  if (persistedSession?.isAuthenticated) {
    return { status: 'authenticated', errorMessage: null };
  }

  return initialAuthSessionState;
}

export function persistAuthenticatedSession(displayName: string | null, avatarUrl: string | null, email: string | null): void {
  window.localStorage.setItem(
    getAuthStorageKey(),
    JSON.stringify(toPersistedAuthSession(true, displayName, avatarUrl, email)),
  );
}

export function getPersistedUserProfile(): { displayName: string | null; avatarUrl: string | null; email: string | null } {
  const persistedSession = readPersistedAuthSession();
  return {
    displayName: persistedSession?.displayName ?? null,
    avatarUrl: persistedSession?.avatarUrl ?? null,
    email: persistedSession?.email ?? null,
  };
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

    if (parsedValue.displayName !== null && typeof parsedValue.displayName !== 'string') {
      return null;
    }

    if (parsedValue.avatarUrl !== null && typeof parsedValue.avatarUrl !== 'string') {
      return null;
    }
    if (parsedValue.email !== undefined && parsedValue.email !== null && typeof parsedValue.email !== 'string') {
      return null;
    }

    return {
      ...parsedValue,
      avatarUrl: isValidAvatarUrl(parsedValue.avatarUrl) ? parsedValue.avatarUrl : null,
      email: parsedValue.email ?? null,
    };
  } catch {
    return null;
  }
}
