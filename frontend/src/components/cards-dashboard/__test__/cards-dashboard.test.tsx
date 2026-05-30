import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CardsDashboard } from '../cards-dashboard';

describe('CardsDashboard', () => {
  it('renderiza dados do dashboard', () => {
    render(
      <CardsDashboard
        state={{
          data: {
            title: 'Cartões',
            count: 'R$ 2.500,00',
            description: 'Maior fatura: R$ 1.900,00',
          },
          isLoading: false,
          hasError: false,
        }}
      />,
    );

    expect(screen.getByRole('heading', { name: 'Cartões' })).toBeInTheDocument();
    expect(screen.getByText('R$ 2.500,00')).toBeInTheDocument();
    expect(screen.getByText('Maior fatura: R$ 1.900,00')).toBeInTheDocument();
  });
});
