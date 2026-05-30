import { describe, expect, it } from 'vitest';
import { parseBankFromTransferNumber, toAccountsFeatureCardData } from '../accounts-feature.utils';

describe('accounts-feature.utils', () => {
  it('faz parser de bank até a primeira barra', () => {
    expect(parseBankFromTransferNumber('001 - Banco Teste/1234/56')).toBe('001 - Banco Teste');
  });

  it('retorna apenas contas correntes formatadas em cards', () => {
    const cards = toAccountsFeatureCardData([
      {
        id: 'acc-1',
        subtype: 'CHECKING_ACCOUNT',
        type: 'checking_account',
        number: '000123-4',
        balance: 1000.5,
        bankData: { transferNumber: 'Banco A/9999' },
      },
      {
        id: 'acc-2',
        subtype: 'CREDIT_CARD',
      },
    ]);

    expect(cards).toHaveLength(1);
    expect(cards[0]).toEqual({
      id: 'acc-1',
      type: 'checking_account',
      number: '000123-4',
      balanceLabel: 'R$ 1.000,50',
      bank: 'Banco A',
    });
  });
});
