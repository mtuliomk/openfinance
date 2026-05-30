import { initialAuthSessionState } from './auth-session.utils';
import type { AuthSessionState } from './auth-session.types';

export function getInitialAuthSessionState(): AuthSessionState {
  return initialAuthSessionState;
}
