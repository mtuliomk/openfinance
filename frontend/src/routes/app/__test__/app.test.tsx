import { render, screen, waitFor } from '@testing-library/react';
import { App } from '../app';

const AUTH_STORAGE_KEY = 'openfinance.auth.session';

describe('App', () => {
  afterEach(() => {
    window.history.replaceState({}, '', '/');
    window.localStorage.clear();
  });

  it('renderiza titulo principal', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: 'OpenFinance POC' })).toBeInTheDocument();
  });

  it('renderiza botão de login Google', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: 'Entrar com conta Google' })).toBeInTheDocument();
  });

  it('redireciona para / quando acessa /home sem estar autenticado', async () => {
    window.history.replaceState({}, '', '/home');

    render(<App />);

    await waitFor(() => {
      expect(window.location.pathname).toBe('/');
    });
  });

  it('mantem /home apos refresh quando sessao estiver persistida', () => {
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ isAuthenticated: true }));
    window.history.replaceState({}, '', '/home');

    render(<App />);

    expect(window.location.pathname).toBe('/home');
    expect(screen.getByText('Bem-vindo')).toBeInTheDocument();
  });
});
