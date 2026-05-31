import { describe, expect, it } from 'vitest';
import type { AccountSummary, TransactionSummary } from '../../../services/proxy-api/proxy-api.types';
import { buildAnalysisDashboardData, buildCategoryMonthlySpendData, getDefaultDateRange } from '../analysis-feature.utils';

const accounts: AccountSummary[] = [
  { id: 'cc-1', subtype: 'CREDIT_CARD' },
  { id: 'cc-2', subtype: 'CREDIT_CARD' },
  { id: 'chk-1', subtype: 'CHECKING_ACCOUNT' },
];

const transactions: TransactionSummary[] = [
  {
    id: 't1',
    accountId: 'cc-1',
    description: 'Mercado',
    amount: 100,
    date: '2026-05-20T10:00:00.000Z',
    category: 'FOOD',
    type: 'DEBIT',
    operationType: null,
    merchant: { name: 'Market A' },
    credit_card_metadata: { installmentNumber: 1, totalInstallments: 4, billId: null },
    paymentData: null,
  },
  {
    id: 't2',
    accountId: 'cc-2',
    description: 'Farmácia',
    amount: 50,
    date: '2026-05-21T10:00:00.000Z',
    category: 'HEALTH',
    type: 'DEBIT',
    operationType: null,
    merchant: { name: 'Pharma B' },
    credit_card_metadata: null,
    paymentData: null,
  },
  {
    id: 't3',
    accountId: 'chk-1',
    description: 'Pix',
    amount: 999,
    date: '2026-05-21T10:00:00.000Z',
    category: 'TRANSFER',
    type: 'DEBIT',
    operationType: null,
    merchant: null,
    credit_card_metadata: null,
    paymentData: null,
  },
];

describe('analysis-feature.utils', () => {
  it('aplica range padrao de 30 dias', () => {
    const range = getDefaultDateRange(new Date('2026-05-31T10:00:00.000Z'));
    expect(range).toEqual({ startDate: '2026-05-02', endDate: '2026-05-31' });
  });

  it('agrega somente transacoes de cartao de credito dentro do periodo', () => {
    const data = buildAnalysisDashboardData({
      accounts,
      transactions,
      startDate: '2026-05-01',
      endDate: '2026-05-31',
    });

    expect(data.categorySpend).toEqual([
      { category: 'FOOD', total: 100 },
      { category: 'HEALTH', total: 50 },
    ]);
    expect(data.topMerchants).toEqual([
      { merchant: 'Market A', total: 100 },
      { merchant: 'Pharma B', total: 50 },
    ]);
  });

  it('calcula total e pendente de parcelamento por merchant', () => {
    const data = buildAnalysisDashboardData({
      accounts,
      transactions,
      startDate: '2026-05-01',
      endDate: '2026-05-31',
    });

    expect(data.installmentsByMerchant).toEqual([{ merchant: 'Market A', total: 100, pending: 300 }]);
  });

  it('retorna vazio quando nao ha dados no periodo', () => {
    const data = buildAnalysisDashboardData({
      accounts,
      transactions,
      startDate: '2026-01-01',
      endDate: '2026-01-31',
    });

    expect(data.categorySpend).toEqual([]);
    expect(data.topMerchants).toEqual([]);
    expect(data.installmentsByMerchant).toEqual([]);
  });

  it('monta dashboard de categoria por mes com top 10 em ordem decrescente', () => {
    const monthlyData = buildCategoryMonthlySpendData({
      accounts,
      transactions: [
        ...transactions,
        {
          id: 't4',
          accountId: 'cc-1',
          description: 'Escola',
          amount: 400,
          date: '2026-04-10T10:00:00.000Z',
          category: 'EDUCATION',
          type: 'DEBIT',
          operationType: null,
          merchant: null,
          credit_card_metadata: null,
          paymentData: null,
        },
        {
          id: 't5',
          accountId: 'cc-1',
          description: 'Transporte',
          amount: 120,
          date: '2026-03-08T10:00:00.000Z',
          category: 'TRANSPORT',
          type: 'DEBIT',
          operationType: null,
          merchant: null,
          credit_card_metadata: null,
          paymentData: null,
        },
      ],
      today: new Date('2026-05-31T10:00:00.000Z'),
    });

    expect(monthlyData.monthLabels).toEqual(['fev de 2026', 'mar de 2026', 'abr de 2026', 'mai de 2026']);
    expect(monthlyData.items[0]?.category).toBe('EDUCATION');
    expect(monthlyData.items[1]?.category).toBe('TRANSPORT');
    expect(monthlyData.items.length).toBeLessThanOrEqual(10);
  });
});
