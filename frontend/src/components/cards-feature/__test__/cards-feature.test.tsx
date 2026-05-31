import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CardsFeature } from '../cards-feature';

describe('CardsFeature', () => {
  it('renderiza transações do cartão selecionado', () => {
    const onCardClick = vi.fn();

    render(
      <CardsFeature
        state={{
          accounts: [
            {
              id: 'card-1',
              name: 'Marco Tulio',
              number: '**** 1234',
              balance: 525.4,
              subtype: 'CREDIT_CARD',
              bankData: { transferNumber: '341/VISA' },
            },
          ],
          isLoading: false,
          hasError: false,
        }}
        transactions={[
          {
            id: 'tx-1',
            accountId: 'card-1',
            description: 'Compra mercado',
            amount: -123.45,
            date: '2026-05-01T00:00:00.000Z',
            category: 'FOOD',
            type: 'DEBIT',
            operationType: null,
            merchant: { name: 'Supermercado XPTO', cnpj: '00.000.000/0001-00' },
            credit_card_metadata: {
              billId: 'bill-1',
              installmentNumber: 2,
              totalInstallments: 10,
            },
            paymentData: null,
          },
        ]}
        transactionsLoading={false}
        transactionsError={false}
        onCardClick={onCardClick}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Abrir cartão **** 1234' }));
    fireEvent.click(screen.getByRole('button', { name: 'Ver detalhes da transação' }));

    expect(screen.getAllByText('FOOD')).toHaveLength(2);
    expect(screen.getByText('Supermercado XPTO')).toBeInTheDocument();
    expect(screen.getByText('parcela: 2 / 10')).toBeInTheDocument();
    expect(onCardClick).toHaveBeenCalledWith('card-1');
  });
});
