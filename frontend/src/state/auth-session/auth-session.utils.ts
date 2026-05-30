import type { AuthSessionState, PersistedAuthSession } from './auth-session.types';
import { AUTH_SESSION_STORAGE_KEY } from './auth-session.types';

export const initialAuthSessionState: AuthSessionState = {
  status: 'idle',
  errorMessage: null,
};

export function getAuthStorageKey(): string {
  return AUTH_SESSION_STORAGE_KEY;
}

export function isValidAvatarUrl(value: string | null): value is string {
  if (!value) {
    return false;
  }

  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}

export function toPersistedAuthSession(
  isAuthenticated: boolean,
  displayName: string | null,
  avatarUrl: string | null,
): PersistedAuthSession {
  return { isAuthenticated, displayName, avatarUrl: isValidAvatarUrl(avatarUrl) ? avatarUrl : null };
}

export function getFirstName(displayName: string | null): string {
  if (!displayName) {
    return 'Usuário';
  }

  const firstToken = displayName.trim().split(/\s+/)[0];
  return firstToken || 'Usuário';
}
