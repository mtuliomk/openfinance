import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AnalysisFeature } from '../analysis-feature';
import type { AccountSummary, TransactionSummary } from '../../../services/proxy-api/proxy-api.types';

const accounts: AccountSummary[] = [{ id: 'cc-1', subtype: 'CREDIT_CARD' }];

const transactions: TransactionSummary[] = [
  {
    id: 't1',
    accountId: 'cc-1',
    description: 'Notebook',
    amount: 1200,
    date: '2026-05-20T10:00:00.000Z',
    category: 'SHOPPING',
    type: 'DEBIT',
    operationType: null,
    merchant: { name: 'Store X' },
    credit_card_metadata: { installmentNumber: 2, totalInstallments: 10, billId: null },
    paymentData: null,
  },
];

describe('analysis-feature', () => {
  it('exibe parcela no valor dentro do modal de detalhes', () => {
    render(<AnalysisFeature accounts={accounts} transactions={transactions} transactionsLoading={false} transactionsError={false} />);

    fireEvent.click(screen.getByRole('button', { name: 'Ver transações do parcelamento por merchant' }));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/\(2\/10\)/)).toBeInTheDocument();
  });
});
