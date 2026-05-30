export interface AuthSessionState {
  status: 'idle' | 'loading' | 'authenticated' | 'error';
  errorMessage: string | null;
}
