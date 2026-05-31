import { useState } from 'react';
import type { CardsFeatureProps } from './cards-feature.types';
import { toCardsFeatureCardData } from './cards-feature.utils';
import type { TransactionSummary } from '../../services/proxy-api/proxy-api.types';
import {
  formatTransactionAmount,
  getTransactionsByAccountId,
  paginateTransactions,
} from '../accounts-feature/accounts-feature.utils';

const TRANSACTIONS_PAGE_SIZE = 10;

export function CardsFeature({ state, transactions, transactionsLoading, transactionsError, onCardClick }: CardsFeatureProps) {
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionSummary | null>(null);
  const [selectedTransactionJson, setSelectedTransactionJson] = useState<TransactionSummary | null>(null);
  const cards = toCardsFeatureCardData(state.accounts);
  const selectedCard = cards.find((card) => card.id === selectedCardId) ?? null;
  const selectedCardTransactions = selectedCardId ? getTransactionsByAccountId(transactions, selectedCardId) : [];
  const totalPages = Math.max(1, Math.ceil(selectedCardTransactions.length / TRANSACTIONS_PAGE_SIZE));
  const paginatedTransactions = paginateTransactions(selectedCardTransactions, currentPage, TRANSACTIONS_PAGE_SIZE);

  if (state.isLoading) {
    return <p>Carregando cartões...</p>;
  }

  if (state.hasError) {
    return <p>Não foi possível carregar cartões.</p>;
  }

  if (cards.length === 0) {
    return <p>Nenhum cartão de crédito disponível.</p>;
  }

  function handleCardClick(cardId: string) {
    setSelectedCardId((current) => (current === cardId ? null : cardId));
    setCurrentPage(1);
    onCardClick?.(cardId);
  }

  return (
    <section className="accounts-feature" aria-label="Cartões disponíveis">
      <div className="accounts-feature__accounts" aria-label="Lista de cartões">
        {cards.map((card) => {
          const isExpanded = selectedCardId === card.id;

          return (
            <article key={card.id} className="accounts-feature__item">
              <button
                type="button"
                className="accounts-feature__card"
                aria-label={`Abrir cartão ${card.number}`}
                aria-expanded={isExpanded}
                onClick={() => handleCardClick(card.id)}
              >
                <p>{`${card.holder} | ${card.number}`}</p>
                <p>{`Bandeira: ${card.brand}`}</p>
                <p>{`Fatura atual: ${card.balanceLabel}`}</p>
              </button>
            </article>
          );
        })}
      </div>

      <div className="accounts-feature__transactions-panel" aria-label="Transações do cartão selecionado">
        {!selectedCard ? <p>Selecione um cartão para visualizar as transações.</p> : null}
        {selectedCard && transactionsLoading ? <p>Carregando transações...</p> : null}
        {selectedCard && transactionsError ? <p>Não foi possível carregar transações.</p> : null}
        {selectedCard && !transactionsLoading && !transactionsError && selectedCardTransactions.length === 0 ? (
          <p>Nenhuma transação para este cartão.</p>
        ) : null}
        {selectedCard && !transactionsLoading && !transactionsError && selectedCardTransactions.length > 0 ? (
          <div className="accounts-feature__transactions">
            <table className="accounts-feature__table">
              <thead>
                <tr>
                  <th scope="col">Data</th>
                  <th scope="col">Descrição</th>
                  <th scope="col">Categoria</th>
                  <th scope="col">Valor</th>
                  <th scope="col" aria-label="Ações" />
                </tr>
              </thead>
              <tbody>
                {paginatedTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{new Date(transaction.date).toLocaleDateString('pt-BR')}</td>
                    <td>{transaction.description}</td>
                    <td>{transaction.category ?? '-'}</td>
                    <td>
                      {formatTransactionAmount(transaction.amount)}
                      {transaction.credit_card_metadata?.installmentNumber && transaction.credit_card_metadata?.totalInstallments
                        ? (
                            <span className="cards-feature__installments">
                              {` (${transaction.credit_card_metadata.installmentNumber}/${transaction.credit_card_metadata.totalInstallments})`}
                            </span>
                          )
                        : ''}
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
            <div className="accounts-feature__pagination">
              <button type="button" onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} disabled={currentPage === 1}>
                Anterior
              </button>
              <span>{`Página ${currentPage} de ${totalPages}`}</span>
              <button type="button" onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} disabled={currentPage === totalPages}>
                Próxima
              </button>
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
            aria-labelledby="card-transaction-details-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="accounts-feature__modal-header">
              <h3 id="card-transaction-details-title">Detalhes</h3>
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
              <p className="accounts-feature__statement-date">{new Date(selectedTransaction.date).toLocaleDateString('pt-BR')}</p>
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
                  <span>merchant</span>
                  <strong>{selectedTransaction.merchant?.name ?? selectedTransaction.merchant?.businessName ?? '-'}</strong>
                </p>
                <p>
                  <span>credit card metadata</span>
                  <strong>
                    {selectedTransaction.credit_card_metadata
                      ? `parcela: ${selectedTransaction.credit_card_metadata.installmentNumber ?? '-'} / ${selectedTransaction.credit_card_metadata.totalInstallments ?? '-'}`
                      : '-'}
                  </strong>
                </p>
                <p>
                  <span>descrição</span>
                  <strong>{selectedTransaction.description || '-'}</strong>
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
            aria-labelledby="card-transaction-json-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="accounts-feature__modal-header">
              <h3 id="card-transaction-json-title">JSON da transação</h3>
              <button
                type="button"
                className="accounts-feature__modal-close"
                aria-label="Fechar modal JSON"
                onClick={() => setSelectedTransactionJson(null)}
              >
                X
              </button>
            </div>
            <pre className="accounts-feature__json-view">{JSON.stringify(selectedTransactionJson, null, 2)}</pre>
          </div>
        </div>
      ) : null}
    </section>
  );
}
