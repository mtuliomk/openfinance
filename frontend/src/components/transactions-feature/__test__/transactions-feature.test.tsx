import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TransactionsFeature } from '../transactions-feature';

describe('TransactionsFeature', () => {
  it('renders transaction summary and recent activity', () => {
    render(
      <TransactionsFeature
        accounts={[{ id: 'acc-1', name: 'Bandeirado', number: '4092', subtype: 'CREDIT_CARD' }]}
        transactions={[
          {
            id: 'tx-1',
            accountId: 'acc-1',
            description: 'Apple Store Morumbi',
            amount: -1250,
            date: '2026-05-20T00:00:00.000Z',
            category: 'Electronics',
            type: 'DEBIT',
            operationType: null,
            paymentData: null,
          },
        ]}
        isLoading={false}
        hasError={false}
      />,
    );

    expect(screen.getByText('CARD SUMMARY')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Recent Activity' })).toBeInTheDocument();
    expect(screen.getByText('Apple Store Morumbi')).toBeInTheDocument();
    expect(screen.getByText('Electronics')).toBeInTheDocument();
  });
});
