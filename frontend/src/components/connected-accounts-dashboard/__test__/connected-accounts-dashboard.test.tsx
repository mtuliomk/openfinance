import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ConnectedAccountsDashboard } from '../connected-accounts-dashboard';

describe('ConnectedAccountsDashboard', () => {
  it('renderiza dados do dashboard', () => {
    render(
      <ConnectedAccountsDashboard
        state={{
          data: { title: 'Contas', count: 2, description: 'Saldo total: R$ 10.000,00' },
          isLoading: false,
          hasError: false,
        }}
      />,
    );

    expect(screen.getByRole('heading', { name: 'Contas' })).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Saldo total: R$ 10.000,00')).toBeInTheDocument();
  });
});
