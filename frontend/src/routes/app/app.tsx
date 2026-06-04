import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { AppShell } from '../../components/app-shell/app-shell';
import { GlobalLoadingOverlay } from '../../components/global-loading-overlay/global-loading-overlay';
import { HomeHero } from '../../components/home-hero/home-hero';
import { getGoogleAuthStartUrl } from '../../services/auth-google/auth-google';
import { handleGoogleAuthCallback } from '../auth-callback/auth-callback';
import {
  clearPersistedSession,
  getInitialAuthSessionState,
  getPersistedUserProfile,
  persistAuthenticatedSession,
} from '../../state/auth-session/auth-session';
import type { AuthSessionState } from '../../state/auth-session/auth-session.types';
import { subscribeNetworkLoading } from '../../state/network-loading/network-loading';
import { Home } from '../home/home';
import { APP_TITLE } from './app.types';
import { getAppDescription } from './app.utils';
import type { HomeFeatureKey } from '../home/home.types';
import { getFirstName } from '../../state/auth-session/auth-session.utils';
import { getAppShellTitle } from '../../components/app-shell/app-shell.utils';

function isHomeRoute(pathname: string): boolean {
  return pathname === '/home';
}

function isAuthCallbackRoute(pathname: string): boolean {
  return pathname.includes('/auth/callback');
}

export function App() {
  const [authState, setAuthState] = useState<AuthSessionState>(getInitialAuthSessionState());
  const [currentPath, setCurrentPath] = useState<string>(window.location.pathname);
  const [isNetworkLoading, setIsNetworkLoading] = useState(false);
  const [activeFeature, setActiveFeature] = useState<HomeFeatureKey>('home');

  useEffect(() => {
    function handleRouteChange() {
      setCurrentPath(window.location.pathname);
    }

    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  useEffect(() => {
    return subscribeNetworkLoading((state) => {
      setIsNetworkLoading(state.activeCount > 0);
    });
  }, []);

  useEffect(() => {
    if (!isAuthCallbackRoute(currentPath)) {
      return;
    }

    handleGoogleAuthCallback(window.location.search).then((result) => {
      if (result.success) {
        persistAuthenticatedSession(result.displayName, result.avatarUrl, result.email);
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

  let content: ReactNode;
  const userProfile = getPersistedUserProfile();

  if (isHomeRoute(currentPath)) {
    if (authState.status === 'authenticated') {
      content = (
        <AppShell
          title={getAppShellTitle(activeFeature)}
          displayName={userProfile.displayName ?? 'Usuário'}
          avatarUrl={userProfile.avatarUrl}
          firstName={getFirstName(userProfile.displayName)}
          activeFeature={activeFeature}
          onFeatureChange={setActiveFeature}
          onLogout={handleLogout}
          onSearch={() => undefined}
        >
          <Home activeFeature={activeFeature} />
        </AppShell>
      );
    } else {
      content = null;
    }
  } else {
    content = <HomeHero title={APP_TITLE} description={description} onGoogleLogin={handleGoogleLogin} />;
  }

  return (
    <>
      {content}
      <GlobalLoadingOverlay isVisible={isNetworkLoading} />
    </>
  );
}

function handleLogout(): void {
  clearPersistedSession();
  window.history.replaceState({}, '', '/');
  window.dispatchEvent(new PopStateEvent('popstate'));
}
