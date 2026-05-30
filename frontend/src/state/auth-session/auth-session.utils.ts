import type { AuthSessionState } from './auth-session.types';

export const initialAuthSessionState: AuthSessionState = {
  status: 'idle',
  errorMessage: null,
};
