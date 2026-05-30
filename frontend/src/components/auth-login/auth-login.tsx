import type { AuthLoginProps } from './auth-login.types';
import { getGoogleButtonLabel } from './auth-login.utils';

export function AuthLogin({ onGoogleLogin }: AuthLoginProps) {
  return (
    <button type="button" className="home-hero__button" onClick={onGoogleLogin} aria-label="Entrar com conta Google">
      {getGoogleButtonLabel()}
    </button>
  );
}
