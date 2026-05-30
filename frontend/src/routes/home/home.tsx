import { useEffect, useMemo, useState } from 'react';
import { CardsDashboard } from '../../components/cards-dashboard/cards-dashboard';
import type { CardsDashboardState } from '../../components/cards-dashboard/cards-dashboard.types';
import { toCardsDashboardData } from '../../components/cards-dashboard/cards-dashboard.utils';
import { ConnectedAccountsDashboard } from '../../components/connected-accounts-dashboard/connected-accounts-dashboard';
import type { ConnectedAccountsDashboardState } from '../../components/connected-accounts-dashboard/connected-accounts-dashboard.types';
import { toConnectedAccountsDashboardData } from '../../components/connected-accounts-dashboard/connected-accounts-dashboard.utils';
import { AccountsFeature } from '../../components/accounts-feature/accounts-feature';
import type { AccountsFeatureState } from '../../components/accounts-feature/accounts-feature.types';
import { InvestmentsDashboard } from '../../components/investments-dashboard/investments-dashboard';
import type { InvestmentsDashboardState } from '../../components/investments-dashboard/investments-dashboard.types';
import { toInvestmentsDashboardData } from '../../components/investments-dashboard/investments-dashboard.utils';
import { listAccounts, listInvestments, listTransactions } from '../../services/proxy-api/proxy-api';
import type { TransactionSummary } from '../../services/proxy-api/proxy-api.types';
import { clearPersistedSession, getPersistedUserProfile } from '../../state/auth-session/auth-session';
import { getFirstName } from '../../state/auth-session/auth-session.utils';
import { HOME_FEATURES } from './home.types';
import type { HomeFeatureKey } from './home.types';
import { getCopyrightText, getHomeFeatureContent, getHomeFeatureLabel } from './home.utils';

declare const __APP_VERSION__: string;

export function Home() {
  const [activeFeature, setActiveFeature] = useState<HomeFeatureKey>('home');
  const [avatarLoadFailed, setAvatarLoadFailed] = useState(false);
  const featureContent = useMemo(() => getHomeFeatureContent(), []);
  const [dashboardState, setDashboardState] = useState<ConnectedAccountsDashboardState>({
    data: toConnectedAccountsDashboardData([]),
    isLoading: true,
    hasError: false,
  });
  const [accountsState, setAccountsState] = useState<AccountsFeatureState>({
    accounts: [],
    isLoading: true,
    hasError: false,
  });
  const [cardsDashboardState, setCardsDashboardState] = useState<CardsDashboardState>({
    data: toCardsDashboardData([]),
    isLoading: true,
    hasError: false,
  });
  const [investmentsDashboardState, setInvestmentsDashboardState] = useState<InvestmentsDashboardState>({
    data: toInvestmentsDashboardData([]),
    isLoading: true,
    hasError: false,
  });
  const [transactions, setTransactions] = useState<TransactionSummary[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [transactionsError, setTransactionsError] = useState(false);
  const activeContent = featureContent[activeFeature];
  const userProfile = getPersistedUserProfile();
  const firstName = getFirstName(userProfile.displayName);
  const showAvatarImage = Boolean(userProfile.avatarUrl) && !avatarLoadFailed;

  useEffect(() => {
    let isMounted = true;

    listAccounts()
      .then((accounts) => {
        if (!isMounted) {
          return;
        }

        setDashboardState({
          data: toConnectedAccountsDashboardData(accounts),
          isLoading: false,
          hasError: false,
        });
        setCardsDashboardState({
          data: toCardsDashboardData(accounts),
          isLoading: false,
          hasError: false,
        });
        setAccountsState({
          accounts,
          isLoading: false,
          hasError: false,
        });
      })
      .catch(() => {
        if (!isMounted) {
          return;
        }

        setDashboardState((current) => ({
          data: current.data,
          isLoading: false,
          hasError: true,
        }));
        setCardsDashboardState((current) => ({
          data: current.data,
          isLoading: false,
          hasError: true,
        }));
        setAccountsState((current) => ({
          accounts: current.accounts,
          isLoading: false,
          hasError: true,
        }));
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    listTransactions()
      .then((loadedTransactions) => {
        if (!isMounted) {
          return;
        }

        setTransactions(loadedTransactions);
        setTransactionsLoading(false);
        setTransactionsError(false);
      })
      .catch(() => {
        if (!isMounted) {
          return;
        }

        setTransactionsLoading(false);
        setTransactionsError(true);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    listInvestments()
      .then((investments) => {
        if (!isMounted) {
          return;
        }

        setInvestmentsDashboardState({
          data: toInvestmentsDashboardData(investments),
          isLoading: false,
          hasError: false,
        });
      })
      .catch(() => {
        if (!isMounted) {
          return;
        }

        setInvestmentsDashboardState((current) => ({
          data: current.data,
          isLoading: false,
          hasError: true,
        }));
      });

    return () => {
      isMounted = false;
    };
  }, []);

  function handleLogout() {
    clearPersistedSession();
    window.history.replaceState({}, '', '/');
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  return (
    <div className="home-layout">
      <aside className="home-layout__sidebar" aria-label="Menu lateral">
        <div className="home-layout__brand">Open Finance 1.0</div>

        <div className="home-layout__user-wrap">
          {showAvatarImage ? (
            <img
              className="home-layout__avatar"
              src={userProfile.avatarUrl ?? undefined}
              alt={`Avatar de ${firstName}`}
              onError={() => setAvatarLoadFailed(true)}
            />
          ) : (
            <span className="home-layout__avatar-fallback" aria-hidden="true">
              {firstName.charAt(0).toUpperCase()}
            </span>
          )}
          <p className="home-layout__user">{firstName}</p>
        </div>
        <hr className="home-layout__divider" />

        <nav aria-label="Funcionalidades" className="home-layout__nav">
          {HOME_FEATURES.map((feature) => (
            <button
              key={feature}
              type="button"
              className="home-layout__menu-item"
              data-active={feature === activeFeature}
              onClick={() => setActiveFeature(feature)}
            >
              {getHomeFeatureLabel(feature)}
            </button>
          ))}
        </nav>

        <hr className="home-layout__divider home-layout__divider--before-logout" />
        <button
          type="button"
          className="home-layout__logout"
          onClick={handleLogout}
          aria-label="Logout"
          title="Logout"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M14 17l-1.4-1.4 2.6-2.6H4v-2h11.2l-2.6-2.6L14 7l5 5-5 5z" />
            <path d="M5 3h10a2 2 0 0 1 2 2v3h-2V5H5v14h10v-3h2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
          </svg>
        </button>
      </aside>

      <main className="home-layout__body" aria-live="polite">
        {activeFeature === 'home' ? (
          <section className="home-layout__dashboard-grid" aria-label="Dashboards da home">
            <ConnectedAccountsDashboard state={dashboardState} />
            <InvestmentsDashboard state={investmentsDashboardState} />
            <CardsDashboard state={cardsDashboardState} />
          </section>
        ) : activeFeature === 'contas' ? (
          <AccountsFeature
            state={accountsState}
            transactions={transactions}
            transactionsLoading={transactionsLoading}
            transactionsError={transactionsError}
          />
        ) : (
          <>
            <h1>{activeContent.title}</h1>
            <h2>{activeContent.subtitle}</h2>
            <p>{activeContent.content}</p>
          </>
        )}
      </main>

      <footer className="home-layout__footer">
        <p>{copyrightText()}</p>
        <p>v{__APP_VERSION__}</p>
      </footer>
    </div>
  );
}

function copyrightText(): string {
  return getCopyrightText();
}
