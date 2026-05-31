import type { AuthCallbackResult } from './auth-callback.types';

export function getCallbackParams(search: string): URLSearchParams {
  return new URLSearchParams(search);
}

export function buildCallbackResult(
  success: boolean,
  errorMessage: string | null,
  displayName: string | null,
  avatarUrl: string | null,
  email: string | null,
): AuthCallbackResult {
  return { success, errorMessage, displayName, avatarUrl, email };
}
