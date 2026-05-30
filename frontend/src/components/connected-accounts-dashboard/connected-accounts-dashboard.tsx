import type { ConnectedAccountsDashboardProps } from './connected-accounts-dashboard.types';

export function ConnectedAccountsDashboard({ state }: ConnectedAccountsDashboardProps) {
  return (
    <article className="home-layout__dashboard">
      <h1 className="home-layout__dashboard-title">{state.data.title}</h1>
      <p className="home-layout__dashboard-number">{state.data.count}</p>
      <p className="home-layout__dashboard-recent">{state.data.description}</p>
      {state.isLoading ? <p>Carregando contas...</p> : null}
      {state.hasError ? <p>Não foi possível carregar contas.</p> : null}
    </article>
  );
}
