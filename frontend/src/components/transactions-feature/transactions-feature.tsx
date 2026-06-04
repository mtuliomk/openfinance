import { useState } from 'react';
import type { TransactionsFeatureProps } from './transactions-feature.types';
import {
  getTotalTransactionPages,
  getTransactionsPageSize,
  paginateTransactionRows,
  toTransactionCardSummary,
  toTransactionRows,
} from './transactions-feature.utils';

export function TransactionsFeature({ accounts, transactions, isLoading, hasError }: TransactionsFeatureProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const rows = toTransactionRows(transactions);
  const summary = toTransactionCardSummary(accounts, transactions);
  const totalPages = getTotalTransactionPages(rows.length);
  const paginatedRows = paginateTransactionRows(rows, currentPage);
  const startRow = rows.length === 0 ? 0 : (currentPage - 1) * getTransactionsPageSize() + 1;
  const endRow = Math.min(rows.length, currentPage * getTransactionsPageSize());

  if (isLoading) {
    return <p>Carregando transações...</p>;
  }

  if (hasError) {
    return <p>Não foi possível carregar transações.</p>;
  }

  return (
    <section className="transactions-feature" aria-label="Transactions">
      <article className="transactions-feature__summary">
        <div className="transactions-feature__summary-left">
          <span className="transactions-feature__summary-icon" aria-hidden="true">
            <TransactionIcon icon="card" />
          </span>
          <div>
            <p className="transactions-feature__eyebrow">{summary.title}</p>
            <h2>{summary.subtitle}</h2>
          </div>
        </div>
        <div className="transactions-feature__summary-value">
          <p>FATURA ATUAL</p>
          <strong>{summary.amountLabel}</strong>
        </div>
      </article>

      <div className="transactions-feature__section-heading">
        <h2>Recent Activity</h2>
        <button type="button" className="transactions-feature__filter">
          FILTER
          <span aria-hidden="true">=</span>
        </button>
      </div>

      <div className="transactions-feature__table-card">
        {rows.length === 0 ? (
          <p className="transactions-feature__empty">Nenhuma transação disponível.</p>
        ) : (
          <>
            <table className="transactions-feature__table">
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
                {paginatedRows.map((row) => (
                  <tr key={row.id}>
                    <td>{row.dateLabel}</td>
                    <td>
                      <span className="transactions-feature__description">
                        <span className="transactions-feature__row-icon" data-kind={row.icon} aria-hidden="true">
                          <TransactionIcon icon={row.icon} />
                        </span>
                        {row.description}
                      </span>
                    </td>
                    <td>
                      <span className="transactions-feature__category">{row.categoryLabel}</span>
                    </td>
                    <td className="transactions-feature__value" data-type={row.valueType}>
                      {row.valueLabel}
                    </td>
                    <td>
                      <button type="button" className="transactions-feature__action" aria-label={`Abrir ${row.description}`}>
                        &gt;
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="transactions-feature__pagination">
              <span>{`Showing ${startRow} to ${endRow} of ${rows.length} entries`}</span>
              <div className="transactions-feature__pagination-actions">
                <button type="button" onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} disabled={currentPage === 1}>
                  &lt;
                </button>
                <span>{`Page ${currentPage} of ${totalPages}`}</span>
                <button type="button" onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} disabled={currentPage === totalPages}>
                  &gt;
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function TransactionIcon({ icon }: { icon: string }) {
  if (icon === 'card') return <span>CC</span>;
  if (icon === 'food') return <span>FD</span>;
  if (icon === 'car') return <span>TR</span>;
  if (icon === 'media') return <span>SV</span>;
  if (icon === 'down') return <span>IN</span>;
  return <span>BG</span>;
}
