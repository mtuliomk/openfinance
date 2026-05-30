import { useEffect, useMemo, useState } from 'react';
import { HomeHero } from '../../components/home-hero/home-hero';
import { getGoogleAuthStartUrl } from '../../services/auth-google/auth-google';
import { handleGoogleAuthCallback } from '../auth-callback/auth-callback';
import { getInitialAuthSessionState } from '../../state/auth-session/auth-session';
import type { AuthSessionState } from '../../state/auth-session/auth-session.types';
import { APP_TITLE } from './app.types';
import { getAppDescription } from './app.utils';

export function App() {
  const [authState, setAuthState] = useState<AuthSessionState>(getInitialAuthSessionState());

  useEffect(() => {
    if (!window.location.pathname.includes('/auth/callback')) {
      return;
    }

    handleGoogleAuthCallback(window.location.search).then((result) => {
      if (result.success) {
        setAuthState({ status: 'authenticated', errorMessage: null });
        window.history.replaceState({}, '', '/');
        return;
      }

      setAuthState({ status: 'error', errorMessage: result.errorMessage });
    });
  }, []);

  const description = useMemo(() => {
    if (authState.status === 'authenticated') {
      return 'Login concluído com sucesso.';
    }

    if (authState.status === 'error' && authState.errorMessage) {
      return authState.errorMessage;
    }

    return getAppDescription();
  }, [authState]);

  function handleGoogleLogin() {
    window.location.assign(getGoogleAuthStartUrl({ returnTo: '/auth/callback' }));
  }

  return <HomeHero title={APP_TITLE} description={description} onGoogleLogin={handleGoogleLogin} />;
}
