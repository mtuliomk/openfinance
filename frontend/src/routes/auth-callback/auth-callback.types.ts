export interface AuthCallbackResult {
  success: boolean;
  errorMessage: string | null;
  displayName: string | null;
  avatarUrl: string | null;
}
