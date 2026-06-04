import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, afterEach, vi } from 'vitest';
import { AppShell } from '../../../components/app-shell/app-shell';
import { Home } from '../home';
import type { HomeFeatureKey } from '../home.types';

function renderShellAndHome(initialFeature: HomeFeatureKey = 'home', onLogout = vi.fn()) {
  function TestHarness() {
    const [activeFeature, setActiveFeature] = useState<HomeFeatureKey>(initialFeature);

    return (
      <AppShell
        title={activeFeature === 'home' ? 'Dashboard' : activeFeature}
        displayName="Marco Tulio"
        avatarUrl="https://img.test/avatar.png"
        firstName="Marco"
        activeFeature={activeFeature}
        onFeatureChange={setActiveFeature}
        onLogout={onLogout}
        onSearch={() => undefined}
      >
        <Home activeFeature={activeFeature} />
      </AppShell>
    );
  }

  render(<TestHarness />);
}

describe('Home', () => {
  afterEach(() => {
    window.localStorage.clear();
    window.history.replaceState({}, '', '/');
    globalThis.fetch = undefined as unknown as typeof fetch;
  });

  it('renderiza layout de shell e primeiro nome do usuario', () => {
    renderShellAndHome();

    expect(screen.getByText('Marco Tulio')).toBeInTheDocument();
    expect(screen.getByText('Premium Account')).toBeInTheDocument();
    expect(screen.getByText('VERIFIED')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Budgets' })).toBeInTheDocument();
    expect(screen.getByText('v0.1.0')).toBeInTheDocument();
  });

  it('mostra fallback quando avatar for invalido', () => {
    function TestHarness() {
      return (
        <AppShell
          title="Dashboard"
          displayName="Marco Tulio"
          avatarUrl={null}
          firstName="Marco"
          activeFeature="home"
          onFeatureChange={() => undefined}
          onLogout={() => undefined}
          onSearch={() => undefined}
        >
          <Home activeFeature="home" />
        </AppShell>
      );
    }

    render(<TestHarness />);

    expect(screen.queryByAltText('Avatar de Marco Tulio')).not.toBeInTheDocument();
    expect(screen.getByText('M')).toBeInTheDocument();
  });

  it('executa logout limpando sessao e redirecionando para /', () => {
    const onLogout = vi.fn();
    renderShellAndHome('home', onLogout);

    fireEvent.click(screen.getByRole('button', { name: 'Logout' }));

    expect(onLogout).toHaveBeenCalledTimes(1);
  });

  it('troca conteúdo ao clicar nas funcionalidades', async () => {
    globalThis.fetch = async () =>
      ({
        ok: true,
        json: async () => [{ id: 'acc-1', name: 'Conta XPTO', balance: 2183.38, subtype: 'CREDIT_CARD' }],
      }) as Response;

    renderShellAndHome();

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Contas' })).toBeInTheDocument();
    });
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('Saldo total: R$ 0,00')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Cartões' })).toBeInTheDocument();
    expect(screen.getByText('Maior fatura: R$ 2.183,38')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Transactions' }));
    expect(screen.getByRole('heading', { name: 'Recent Activity' })).toBeInTheDocument();
    expect(screen.getByText('CARD SUMMARY')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Accounts' }));
    expect(screen.getByText('Nenhuma conta corrente disponível.')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Budgets' }));
    expect(screen.getByRole('heading', { name: 'Análise de Cartões' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Gasto por categoria' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Top 4 merchants' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Parcelamento por merchant' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Settings' }));
    expect(screen.getByRole('heading', { name: 'Sincronização Open Finance' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Atualizar agora' })).toBeInTheDocument();
  });
});
