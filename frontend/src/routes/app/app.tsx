import { useEffect, useMemo, useState } from 'react';
import { HomeHero } from '../../components/home-hero/home-hero';
import { getGoogleAuthStartUrl } from '../../services/auth-google/auth-google';
import { handleGoogleAuthCallback } from '../auth-callback/auth-callback';
import {
  clearPersistedSession,
  getInitialAuthSessionState,
  persistAuthenticatedSession,
} from '../../state/auth-session/auth-session';
import type { AuthSessionState } from '../../state/auth-session/auth-session.types';
import { Home } from '../home/home';
import { APP_TITLE } from './app.types';
import { getAppDescription } from './app.utils';

function isHomeRoute(pathname: string): boolean {
  return pathname === '/home';
}

function isAuthCallbackRoute(pathname: string): boolean {
  return pathname.includes('/auth/callback');
}

export function App() {
  const [authState, setAuthState] = useState<AuthSessionState>(getInitialAuthSessionState());
  const [currentPath, setCurrentPath] = useState<string>(window.location.pathname);

  useEffect(() => {
    function handleRouteChange() {
      setCurrentPath(window.location.pathname);
    }

    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  useEffect(() => {
    if (!isAuthCallbackRoute(currentPath)) {
      return;
    }

    handleGoogleAuthCallback(window.location.search).then((result) => {
      if (result.success) {
        persistAuthenticatedSession(result.displayName, result.avatarUrl);
        setAuthState({ status: 'authenticated', errorMessage: null });
        window.history.replaceState({}, '', '/home');
        setCurrentPath('/home');
        return;
      }

      clearPersistedSession();
      setAuthState({ status: 'error', errorMessage: result.errorMessage });
    });
  }, [currentPath]);

  useEffect(() => {
    if (!isHomeRoute(currentPath)) {
      return;
    }

    if (authState.status !== 'authenticated') {
      clearPersistedSession();
      window.history.replaceState({}, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  }, [authState, currentPath]);

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

  if (isHomeRoute(currentPath)) {
    if (authState.status === 'authenticated') {
      return <Home />;
    }

    return null;
  }

  return <HomeHero title={APP_TITLE} description={description} onGoogleLogin={handleGoogleLogin} />;
}
