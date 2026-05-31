import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, afterEach } from 'vitest';
import { Home } from '../home';

const AUTH_STORAGE_KEY = 'openfinance.auth.session';

describe('Home', () => {
  afterEach(() => {
    window.localStorage.clear();
    window.history.replaceState({}, '', '/');
    globalThis.fetch = undefined as unknown as typeof fetch;
  });

  it('renderiza avatar e primeiro nome do usuario', () => {
    window.localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({
        isAuthenticated: true,
        displayName: 'Marco Tulio',
        avatarUrl: 'https://img.test/avatar.png',
      }),
    );

    render(<Home />);

    expect(screen.getByText('Open Finance 1.0')).toBeInTheDocument();
    expect(screen.getByText('Marco')).toBeInTheDocument();
    expect(screen.getByAltText('Avatar de Marco')).toBeInTheDocument();
    expect(screen.getByText('v0.1.0')).toBeInTheDocument();
  });

  it('mostra fallback quando avatar for invalido', () => {
    window.localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({
        isAuthenticated: true,
        displayName: 'Marco Tulio',
        avatarUrl: 'not-a-url',
      }),
    );

    render(<Home />);

    expect(screen.queryByAltText('Avatar de Marco')).not.toBeInTheDocument();
    expect(screen.getByText('M')).toBeInTheDocument();
  });

  it('executa logout limpando sessao e redirecionando para /', () => {
    window.localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({
        isAuthenticated: true,
        displayName: 'Marco Tulio',
        avatarUrl: 'https://img.test/avatar.png',
      }),
    );
    window.history.replaceState({}, '', '/home');

    render(<Home />);

    fireEvent.click(screen.getByRole('button', { name: 'Logout' }));

    expect(window.localStorage.getItem(AUTH_STORAGE_KEY)).toBeNull();
    expect(window.location.pathname).toBe('/');
  });

  it('troca conteúdo ao clicar nas funcionalidades', async () => {
    globalThis.fetch = async () =>
      ({
        ok: true,
        json: async () => [{ id: 'acc-1', name: 'Conta XPTO', balance: 2183.38, subtype: 'CREDIT_CARD' }],
      }) as Response;

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Contas' })).toBeInTheDocument();
    });
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('Saldo total: R$ 0,00')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Cartões' })).toBeInTheDocument();
    expect(screen.getByText('Maior fatura: R$ 2.183,38')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'investimentos' }));
    expect(screen.getByRole('heading', { name: 'Investimentos' })).toBeInTheDocument();
    expect(screen.getByText('Posição consolidada')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'atualizar' }));
    expect(screen.getByRole('heading', { name: 'Atualizar' })).toBeInTheDocument();
    expect(screen.getByText('Sincronização Open Finance')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Atualizar agora' })).toBeInTheDocument();
  });
});
