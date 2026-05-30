import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { InvestmentsDashboard } from '../investments-dashboard';

describe('InvestmentsDashboard', () => {
  it('renderiza dados do dashboard', () => {
    render(
      <InvestmentsDashboard
        state={{
          data: {
            title: 'Investimentos',
            count: 'R$ 3.000,00',
            description: 'Aporte em 30 dias: R$ 1.000,00',
          },
          isLoading: false,
          hasError: false,
        }}
      />,
    );

    expect(screen.getByRole('heading', { name: 'Investimentos' })).toBeInTheDocument();
    expect(screen.getByText('R$ 3.000,00')).toBeInTheDocument();
    expect(screen.getByText('Aporte em 30 dias: R$ 1.000,00')).toBeInTheDocument();
  });
});
