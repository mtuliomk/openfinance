import { useEffect, useMemo, useState } from 'react';
import { CardsDashboard } from '../../components/cards-dashboard/cards-dashboard';
import type { CardsDashboardState } from '../../components/cards-dashboard/cards-dashboard.types';
import { toCardsDashboardData } from '../../components/cards-dashboard/cards-dashboard.utils';
import { ConnectedAccountsDashboard } from '../../components/connected-accounts-dashboard/connected-accounts-dashboard';
import type { ConnectedAccountsDashboardState } from '../../components/connected-accounts-dashboard/connected-accounts-dashboard.types';
import { toConnectedAccountsDashboardData } from '../../components/connected-accounts-dashboard/connected-accounts-dashboard.utils';
import { AccountsFeature } from '../../components/accounts-feature/accounts-feature';
import type { AccountsFeatureState } from '../../components/accounts-feature/accounts-feature.types';
import { CardsFeature } from '../../components/cards-feature/cards-feature';
import type { CardsFeatureState } from '../../components/cards-feature/cards-feature.types';
import { InvestmentsDashboard } from '../../components/investments-dashboard/investments-dashboard';
import type { InvestmentsDashboardState } from '../../components/investments-dashboard/investments-dashboard.types';
import { toInvestmentsDashboardData } from '../../components/investments-dashboard/investments-dashboard.utils';
import { AnalysisFeature } from '../../components/analysis-feature/analysis-feature';
import { TransactionsFeature } from '../../components/transactions-feature/transactions-feature';
import { listAccounts, listInvestments, listTransactions, reloadOpenFinance } from '../../services/proxy-api/proxy-api';
import type { OpenFinanceReloadResult, TransactionSummary } from '../../services/proxy-api/proxy-api.types';
import type { HomeProps } from './home.types';
import { getCopyrightText, getHomeFeatureContent } from './home.utils';

declare const __APP_VERSION__: string;

export function Home({ activeFeature = 'home' }: HomeProps) {
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
  const [cardsState, setCardsState] = useState<CardsFeatureState>({
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
  const [reloadStatus, setReloadStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [reloadProgress, setReloadProgress] = useState(0);
  const [reloadResult, setReloadResult] = useState<OpenFinanceReloadResult | null>(null);
  const [reloadErrorMessage, setReloadErrorMessage] = useState<string | null>(null);
  const activeContent = featureContent[activeFeature];

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
        setCardsState({
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
        setCardsState((current) => ({
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

  async function handleReloadOpenFinance() {
    setReloadStatus('loading');
    setReloadProgress(15);
    setReloadResult(null);
    setReloadErrorMessage(null);

    const interval = window.setInterval(() => {
      setReloadProgress((current) => (current >= 90 ? current : current + 10));
    }, 250);

    try {
      const result = await reloadOpenFinance();
      window.clearInterval(interval);
      setReloadProgress(100);
      setReloadStatus('success');
      setReloadResult(result);
    } catch (error) {
      window.clearInterval(interval);
      setReloadProgress(100);
      setReloadStatus('error');
      setReloadErrorMessage(error instanceof Error ? error.message : 'Falha ao atualizar open finance');
    }
  }

  return (
    <div className="home-page">
      <section className="home-page__body" aria-live="polite">
        {activeFeature === 'home' ? (
          <section className="home-page__dashboard-grid" aria-label="Dashboards da home">
            <ConnectedAccountsDashboard state={dashboardState} />
            <InvestmentsDashboard state={investmentsDashboardState} />
            <CardsDashboard state={cardsDashboardState} />
          </section>
        ) : activeFeature === 'transactions' ? (
          <TransactionsFeature
            accounts={cardsState.accounts}
            transactions={transactions}
            isLoading={transactionsLoading}
            hasError={transactionsError}
          />
        ) : activeFeature === 'contas' ? (
          <AccountsFeature
            state={accountsState}
            transactions={transactions}
            transactionsLoading={transactionsLoading}
            transactionsError={transactionsError}
          />
        ) : activeFeature === 'cartoes' ? (
          <CardsFeature
            state={cardsState}
            transactions={transactions}
            transactionsLoading={transactionsLoading}
            transactionsError={transactionsError}
          />
        ) : activeFeature === 'analise' ? (
          <AnalysisFeature
            accounts={cardsState.accounts}
            transactions={transactions}
            transactionsLoading={transactionsLoading}
            transactionsError={transactionsError}
          />
        ) : activeFeature === 'atualizar' ? (
          <section className="home-page__reload-status" aria-label="Status da atualização">
            <h2>Sincronização Open Finance</h2>
            <button
              type="button"
              className="home-page__reload-action"
              onClick={handleReloadOpenFinance}
              disabled={reloadStatus === 'loading'}
            >
              {reloadStatus === 'loading' ? 'Atualizando...' : 'Atualizar agora'}
            </button>
            <div
              className="home-page__progress-track"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={reloadProgress}
            >
              <span className="home-page__progress-fill" style={{ width: `${reloadProgress}%` }} />
            </div>
            <p className="home-page__reload-message">
              {reloadStatus === 'loading' && 'Atualizando dados...'}
              {reloadStatus === 'success' && 'Atualização concluída com sucesso.'}
              {reloadStatus === 'error' && `Falha na atualização: ${reloadErrorMessage ?? 'erro inesperado'}`}
              {reloadStatus === 'idle' && 'Nenhuma atualização iniciada.'}
            </p>
            {reloadResult ? <pre className="home-page__reload-payload">{JSON.stringify(reloadResult, null, 2)}</pre> : null}
          </section>
        ) : (
          <>
            <h2>{activeContent.subtitle}</h2>
            <p>{activeContent.content}</p>
          </>
        )}
      </section>

      <footer className="home-page__footer">
        <p>{copyrightText()}</p>
        <p>v{__APP_VERSION__}</p>
      </footer>
    </div>
  );
}

function copyrightText(): string {
  return getCopyrightText();
}
