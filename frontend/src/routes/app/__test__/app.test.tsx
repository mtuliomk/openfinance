import { render, screen } from '@testing-library/react';
import { App } from '../app';

describe('App', () => {
  it('renderiza titulo principal', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: 'OpenFinance POC' })).toBeInTheDocument();
  });

  it('renderiza botão de login Google', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: 'Entrar com conta Google' })).toBeInTheDocument();
  });
});
