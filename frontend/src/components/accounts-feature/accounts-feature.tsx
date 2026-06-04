import { useState } from 'react';
import type { AccountsFeatureProps } from './accounts-feature.types';
import type { TransactionSummary } from '../../services/proxy-api/proxy-api.types';
import {
  formatTransactionAmount,
  getTransactionsByAccountId,
  paginateTransactions,
  toAccountsFeatureCardData,
} from './accounts-feature.utils';

const TRANSACTIONS_PAGE_SIZE = 10;

export function AccountsFeature({ state, transactions, transactionsLoading, transactionsError, onAccountClick }: AccountsFeatureProps) {
  const [expandedAccountId, setExpandedAccountId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionSummary | null>(null);
  const [selectedTransactionJson, setSelectedTransactionJson] = useState<TransactionSummary | null>(null);
  const cards = toAccountsFeatureCardData(state.accounts);
  const selectedDescription = selectedTransaction ? getModalDescription(selectedTransaction) : null;
  const selectedDescriptionParts = selectedDescription ? toDescriptionParts(selectedDescription) : null;
  const selectedAccountTransactions = expandedAccountId ? getTransactionsByAccountId(transactions, expandedAccountId) : [];
  const totalPages = Math.max(1, Math.ceil(selectedAccountTransactions.length / TRANSACTIONS_PAGE_SIZE));
  const paginatedTransactions = paginateTransactions(selectedAccountTransactions, currentPage, TRANSACTIONS_PAGE_SIZE);

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
      <div className="accounts-feature__accounts" aria-label="Lista de contas">
        {cards.map((card) => {
          const isExpanded = expandedAccountId === card.id;
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
          </article>
        );
        })}
      </div>

      <div className="accounts-feature__transactions-panel" aria-label="Transações da conta selecionada">
        {!expandedAccountId ? <p>Selecione uma conta para visualizar as transações.</p> : null}
        {expandedAccountId && transactionsLoading ? <p>Carregando transações...</p> : null}
        {expandedAccountId && transactionsError ? <p>Não foi possível carregar transações.</p> : null}
        {expandedAccountId && !transactionsLoading && !transactionsError && selectedAccountTransactions.length === 0 ? (
          <p>Nenhuma transação para esta conta.</p>
        ) : null}
        {expandedAccountId && !transactionsLoading && !transactionsError && selectedAccountTransactions.length > 0 ? (
          <div className="accounts-feature__transactions">
            <div className="transactions-feature__section-heading">
              <h2>Recent Activity</h2>
              <button type="button" className="transactions-feature__filter">
                FILTER
                <span aria-hidden="true">=</span>
              </button>
            </div>
            <table className="accounts-feature__table">
              <thead>
                <tr>
                  <th scope="col">DATE</th>
                  <th scope="col">DESCRIPTION</th>
                  <th scope="col">CATEGORY</th>
                  <th scope="col">VALUE</th>
                  <th scope="col">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {paginatedTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{new Date(transaction.date).toLocaleDateString('pt-BR')}</td>
                    <td>
                      <span className="transactions-feature__description">
                        <span className="transactions-feature__row-icon" aria-hidden="true">TX</span>
                        {transaction.description}
                      </span>
                    </td>
                    <td>
                      <span className="transactions-feature__category">{transaction.category ?? 'Uncategorized'}</span>
                    </td>
                    <td className="transactions-feature__value" data-type={transaction.amount > 0 ? 'credit' : transaction.amount < 0 ? 'debit' : 'neutral'}>
                      {formatTransactionAmount(transaction.amount)}
                    </td>
                    <td className="accounts-feature__action-cell">
                      <div className="accounts-feature__action-group">
                        <button
                          type="button"
                          className="accounts-feature__action-button"
                          aria-label="Ver JSON completo da transação"
                          onClick={() => setSelectedTransactionJson(transaction)}
                        >
                          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                            <path d="M8.2 7.1 4.3 12l3.9 4.9-1.6 1.2L1.7 12l4.9-6.1 1.6 1.2zm7.6 0 1.6-1.2 4.9 6.1-4.9 6.1-1.6-1.2 3.9-4.9-3.9-4.9zM9.2 20l3.4-16 2 .4-3.4 16-2-.4z" />
                          </svg>
                        </button>
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
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="accounts-feature__pagination transactions-feature__pagination">
              <span>{`Showing ${(currentPage - 1) * TRANSACTIONS_PAGE_SIZE + 1} to ${Math.min(selectedAccountTransactions.length, currentPage * TRANSACTIONS_PAGE_SIZE)} of ${selectedAccountTransactions.length} entries`}</span>
              <div className="transactions-feature__pagination-actions">
              <button type="button" onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} disabled={currentPage === 1}>
                &lt;
              </button>
              <span>{`Página ${currentPage} de ${totalPages}`}</span>
              <button type="button" onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} disabled={currentPage === totalPages}>
                &gt;
              </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>

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

      {selectedTransactionJson ? (
        <div
          className="accounts-feature__modal-backdrop accounts-feature__modal-backdrop--json"
          role="presentation"
          onClick={() => setSelectedTransactionJson(null)}
        >
          <div
            className="accounts-feature__modal accounts-feature__modal--json"
            role="dialog"
            aria-modal="true"
            aria-labelledby="transaction-json-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="accounts-feature__modal-header">
              <h3 id="transaction-json-title">JSON da transação</h3>
              <button
                type="button"
                className="accounts-feature__modal-close"
                aria-label="Fechar modal JSON"
                onClick={() => setSelectedTransactionJson(null)}
              >
                X
              </button>
            </div>
            <pre className="accounts-feature__json-view">
              {JSON.stringify(selectedTransactionJson, null, 2)}
            </pre>
          </div>
        </div>
      ) : null}
    </section>
  );
}
