import { useMemo, useState } from 'react';
import type { TransactionSummary } from '../../services/proxy-api/proxy-api.types';
import type { AnalysisFeatureProps } from './analysis-feature.types';
import {
  buildAnalysisDashboardData,
  buildCategoryMonthlySpendData,
  formatCurrency,
  getCreditCardTransactionsInRange,
  getDefaultDateRange,
} from './analysis-feature.utils';

export function AnalysisFeature({ accounts, transactions, transactionsLoading, transactionsError }: AnalysisFeatureProps) {
  const defaultRange = useMemo(() => getDefaultDateRange(), []);
  const [startDate, setStartDate] = useState(defaultRange.startDate);
  const [endDate, setEndDate] = useState(defaultRange.endDate);
  const [modalState, setModalState] = useState<{ title: string; transactions: TransactionSummary[] } | null>(null);

  const dashboardData = useMemo(
    () => buildAnalysisDashboardData({ accounts, transactions, startDate, endDate }),
    [accounts, transactions, startDate, endDate],
  );
  const filteredTransactions = useMemo(
    () => getCreditCardTransactionsInRange({ accounts, transactions, startDate, endDate }),
    [accounts, transactions, startDate, endDate],
  );
  const categoryMonthlySpendData = useMemo(
    () => buildCategoryMonthlySpendData({ accounts, transactions }),
    [accounts, transactions],
  );

  return (
    <section className="analysis-feature" aria-label="Análise de cartões">
      <header className="analysis-feature__header">
        <h1>Análise de Cartões</h1>
        <div className="analysis-feature__filters" aria-label="Filtro por data">
          <label>
            Data inicial
            <input type="date" value={startDate} max={endDate} onChange={(event) => setStartDate(event.target.value)} />
          </label>
          <label>
            Data final
            <input type="date" value={endDate} min={startDate} onChange={(event) => setEndDate(event.target.value)} />
          </label>
        </div>
      </header>

      {transactionsLoading ? <p>Carregando transações...</p> : null}
      {transactionsError ? <p>Não foi possível carregar transações.</p> : null}

      {!transactionsLoading && !transactionsError ? (
        <div className="analysis-feature__grid">
          <article className="analysis-feature__card">
            <h2>Gasto por categoria</h2>
            {dashboardData.categorySpend.length === 0 ? (
              <p>Nenhum dado no período.</p>
            ) : (
              <ul>
                {dashboardData.categorySpend.map((item) => (
                  <li key={item.category}>
                    <span>{item.category}</span>
                    <strong className="analysis-feature__value-wrap">
                      {formatCurrency(item.total)}
                      <button
                        type="button"
                        className="analysis-feature__icon-button"
                        aria-label="Ver transações da categoria"
                        onClick={() =>
                          setModalState({
                            title: `Transações da categoria ${item.category}`,
                            transactions: filteredTransactions.filter(
                              (transaction) => (transaction.category?.trim() || 'Sem categoria') === item.category,
                            ),
                          })
                        }
                      >
                        🔍
                      </button>
                    </strong>
                  </li>
                ))}
              </ul>
            )}
          </article>

          <article className="analysis-feature__card">
            <h2>Top 4 merchants</h2>
            {dashboardData.topMerchants.length === 0 ? (
              <p>Nenhum dado no período.</p>
            ) : (
              <ol>
                {dashboardData.topMerchants.map((item) => (
                  <li key={item.merchant}>
                    <span>{item.merchant}</span>
                    <strong className="analysis-feature__value-wrap">
                      {formatCurrency(item.total)}
                      <button
                        type="button"
                        className="analysis-feature__icon-button"
                        aria-label="Ver transações do merchant"
                        onClick={() =>
                          setModalState({
                            title: `Transações de ${item.merchant}`,
                            transactions: filteredTransactions.filter((transaction) => {
                              if (transaction.amount <= 0) {
                                return false;
                              }
                              const merchant = transaction.merchant?.name?.trim() || transaction.merchant?.businessName?.trim() || 'Desconhecido';
                              return merchant === item.merchant;
                            }),
                          })
                        }
                      >
                        🔍
                      </button>
                    </strong>
                  </li>
                ))}
              </ol>
            )}
          </article>

          <article className="analysis-feature__card">
            <h2>Parcelamento por merchant</h2>
            {dashboardData.installmentsByMerchant.length === 0 ? (
              <p>Nenhum parcelamento no período.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Merchant</th>
                    <th>Total</th>
                    <th>Total pendente</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.installmentsByMerchant.map((item) => (
                    <tr key={item.merchant}>
                      <td>{item.merchant}</td>
                      <td>
                        <strong className="analysis-feature__value-wrap">
                          {formatCurrency(item.total)}
                          <button
                            type="button"
                            className="analysis-feature__icon-button"
                            aria-label="Ver transações do parcelamento por merchant"
                            onClick={() =>
                              setModalState({
                                title: `Parcelamentos de ${item.merchant}`,
                                transactions: filteredTransactions.filter((transaction) => {
                                  const merchant = transaction.merchant?.name?.trim() || transaction.merchant?.businessName?.trim() || 'Desconhecido';
                                  const metadata = transaction.credit_card_metadata;
                                  return merchant === item.merchant && Boolean(metadata?.installmentNumber && metadata?.totalInstallments && metadata.totalInstallments > 1);
                                }),
                              })
                            }
                          >
                            🔍
                          </button>
                        </strong>
                      </td>
                      <td>{formatCurrency(item.pending)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </article>

          <article className="analysis-feature__card">
            <h2>Gasto por categoria nos últimos 4 meses</h2>
            {categoryMonthlySpendData.items.length === 0 ? (
              <p>Nenhum dado no período.</p>
            ) : (
              <div className="analysis-feature__category-monthly-scroll">
                <table className="analysis-feature__category-monthly-table">
                  <thead>
                    <tr>
                      <th>Categoria</th>
                      {categoryMonthlySpendData.monthLabels.map((label) => (
                        <th key={label}>{label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {categoryMonthlySpendData.items.map((item) => (
                      <tr key={item.category}>
                        <td>{item.category}</td>
                        {item.monthlyCosts.map((cost, index) => (
                          <td key={`${item.category}-${categoryMonthlySpendData.monthLabels[index]}`}>{formatCurrency(cost)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </article>
        </div>
      ) : null}

      {modalState ? (
        <div className="accounts-feature__modal-backdrop" role="presentation" onClick={() => setModalState(null)}>
          <div
            className="accounts-feature__modal analysis-feature__transactions-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="analysis-transactions-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="accounts-feature__modal-header">
              <h3 id="analysis-transactions-title">{modalState.title}</h3>
              <button type="button" className="accounts-feature__modal-close" aria-label="Fechar modal" onClick={() => setModalState(null)}>
                X
              </button>
            </div>
            <div className="analysis-feature__transactions-scroll">
              {modalState.transactions.length === 0 ? (
                <p>Nenhuma transação encontrada.</p>
              ) : (
                <table className="accounts-feature__table">
                  <thead>
                    <tr>
                      <th>Data</th>
                      <th>Descrição</th>
                      <th>Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {modalState.transactions.map((transaction) => (
                      <tr key={transaction.id}>
                        <td>{new Date(transaction.date).toLocaleDateString('pt-BR')}</td>
                        <td>{transaction.description}</td>
                        <td>
                          {formatCurrency(transaction.amount)}
                          {transaction.credit_card_metadata?.installmentNumber && transaction.credit_card_metadata?.totalInstallments
                            ? (
                                <span className="analysis-feature__installment-text">
                                  {' '}
                                  ({transaction.credit_card_metadata.installmentNumber}/{transaction.credit_card_metadata.totalInstallments})
                                </span>
                              )
                            : ''}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
