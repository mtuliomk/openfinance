import { useState } from 'react';
import type { AccountsFeatureProps } from './accounts-feature.types';
import type { TransactionSummary } from '../../services/proxy-api/proxy-api.types';
import {
  formatTransactionAmount,
  getTransactionsByAccountId,
  paginateTransactions,
  toAccountsFeatureCardData,
} from './accounts-feature.utils';

const TRANSACTIONS_PAGE_SIZE = 30;

export function AccountsFeature({ state, transactions, transactionsLoading, transactionsError, onAccountClick }: AccountsFeatureProps) {
  const [expandedAccountId, setExpandedAccountId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionSummary | null>(null);
  const cards = toAccountsFeatureCardData(state.accounts);
  const selectedDescription = selectedTransaction ? getModalDescription(selectedTransaction) : null;
  const selectedDescriptionParts = selectedDescription ? toDescriptionParts(selectedDescription) : null;

  if (state.isLoading) {
    return <p>Carregando contas...</p>;
  }

  if (state.hasError) {
    return <p>Não foi possível carregar contas.</p>;
  }

  if (cards.length === 0) {
    return <p>Nenhuma conta corrente disponível.</p>;
  }

  function handleAccountClick(accountId: string) {
    setExpandedAccountId((current) => (current === accountId ? null : accountId));
    setCurrentPage(1);
    onAccountClick?.(accountId);
  }

  function getModalDescription(transaction: TransactionSummary): string {
    if (transaction.operationType !== 'PIX') {
      return transaction.description;
    }

    const participant = transaction.type === 'CREDIT' ? transaction.paymentData?.payer : transaction.paymentData?.receiver;
    if (!participant) {
      return transaction.description;
    }

    const details = [
      participant.name ? `Nome: ${participant.name}` : null,
      participant.documentNumber?.value ? `CPF: ${participant.documentNumber.value}` : null,
      participant.routingNumber ? `Banco: ${participant.routingNumber}` : null,
      participant.branchNumber || participant.accountNumber
        ? `ag / conta: ${participant.branchNumber ?? '-'} / ${participant.accountNumber ?? '-'}`
        : null,
    ].filter((value): value is string => Boolean(value));

    return details.length > 0 ? `${transaction.description} | ${details.join(' | ')}` : transaction.description;
  }

  function toDescriptionParts(value: string): { title: string; details: string[] } {
    const parts = value
      .split('|')
      .map((part) => part.trim())
      .filter((part) => part.length > 0);

    if (parts.length === 0) {
      return { title: '-', details: [] };
    }

    return {
      title: parts[0] ?? '-',
      details: parts.slice(1),
    };
  }

  return (
    <section className="accounts-feature" aria-label="Contas disponíveis">
      {cards.map((card) => {
        const isExpanded = expandedAccountId === card.id;
        const accountTransactions = getTransactionsByAccountId(transactions, card.id);
        const totalPages = Math.max(1, Math.ceil(accountTransactions.length / TRANSACTIONS_PAGE_SIZE));
        const paginatedTransactions = paginateTransactions(accountTransactions, currentPage, TRANSACTIONS_PAGE_SIZE);

        return (
          <article key={card.id} className="accounts-feature__item">
            <button
              type="button"
              className="accounts-feature__card"
              aria-label={`Abrir conta ${card.number}`}
              aria-expanded={isExpanded}
              onClick={() => handleAccountClick(card.id)}
            >
              <p>{`${card.type} | ${card.number} | ${card.bank}`}</p>
              <p>{`Saldo: ${card.balanceLabel}`}</p>
            </button>

            {isExpanded ? (
              <div className="accounts-feature__transactions" aria-label="Transações da conta">
                {transactionsLoading ? <p>Carregando transações...</p> : null}
                {transactionsError ? <p>Não foi possível carregar transações.</p> : null}
                {!transactionsLoading && !transactionsError && accountTransactions.length === 0 ? (
                  <p>Nenhuma transação para esta conta.</p>
                ) : null}
                {!transactionsLoading && !transactionsError && accountTransactions.length > 0 ? (
                  <table className="accounts-feature__table">
                    <thead>
                      <tr>
                        <th scope="col">Data</th>
                        <th scope="col">Descrição</th>
                        <th scope="col">Valor</th>
                        <th scope="col" aria-label="Ações" />
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedTransactions.map((transaction) => (
                        <tr key={transaction.id}>
                          <td>{new Date(transaction.date).toLocaleDateString('pt-BR')}</td>
                          <td>{transaction.description}</td>
                          <td>{formatTransactionAmount(transaction.amount)}</td>
                          <td className="accounts-feature__action-cell">
                            <button
                              type="button"
                              className="accounts-feature__action-button"
                              aria-label="Ver detalhes da transação"
                              onClick={() => setSelectedTransaction(transaction)}
                            >
                              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                                <path d="M10 2a8 8 0 1 0 5 14.3l5.4 5.4 1.4-1.4-5.4-5.4A8 8 0 0 0 10 2zm0 2a6 6 0 1 1 0 12 6 6 0 0 1 0-12z" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : null}
                {!transactionsLoading && !transactionsError && accountTransactions.length > 0 ? (
                  <div className="accounts-feature__pagination">
                    <button type="button" onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} disabled={currentPage === 1}>
                      Anterior
                    </button>
                    <span>{`Página ${currentPage} de ${totalPages}`}</span>
                    <button
                      type="button"
                      onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Próxima
                    </button>
                  </div>
                ) : null}
              </div>
            ) : null}
          </article>
        );
      })}

      {selectedTransaction ? (
        <div className="accounts-feature__modal-backdrop" role="presentation" onClick={() => setSelectedTransaction(null)}>
          <div
            className="accounts-feature__modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="transaction-details-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="accounts-feature__modal-header">
              <h3 id="transaction-details-title">Detalhes</h3>
              <button
                type="button"
                className="accounts-feature__modal-close"
                aria-label="Fechar modal"
                onClick={() => setSelectedTransaction(null)}
              >
                X
              </button>
            </div>
            <div className="accounts-feature__statement">
              <p className="accounts-feature__statement-label">Data</p>
              <p className="accounts-feature__statement-date">
                {new Date(selectedTransaction.date).toLocaleDateString('pt-BR')}
              </p>

              <div className="accounts-feature__statement-amount">
                <strong data-type={selectedTransaction.type?.toLowerCase() ?? 'other'}>
                  {formatTransactionAmount(selectedTransaction.amount)}
                </strong>
              </div>

              <div className="accounts-feature__statement-body">
                <p>
                  <span>categoria</span>
                  <strong>{selectedTransaction.category ?? '-'}</strong>
                </p>
                <p>
                  <span>tipo</span>
                  <strong>{selectedTransaction.type ?? '-'}</strong>
                </p>
                <p>
                  <span>descrição</span>
                  <span className="accounts-feature__description-wrap">
                    <strong className="accounts-feature__description-title">{selectedDescriptionParts?.title ?? '-'}</strong>
                    {selectedDescriptionParts && selectedDescriptionParts.details.length > 0 ? (
                      <span className="accounts-feature__description-meta">
                        {selectedDescriptionParts.details.map((detail) => (
                          <span key={detail} className="accounts-feature__description-chip">
                            {detail}
                          </span>
                        ))}
                      </span>
                    ) : null}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
