import { listItems } from '../items/items.js';
import type { ReloadDependencies, ReloadResult } from './openfinance-reload.types.js';
import {
  normalizePluggyAccount,
  toInvestmentCreateInput,
  toConsentCreateInput,
  toIdentityCreateInput,
  toLoanCreateInput,
  toBillCreateInput,
  toAccountCreateInput,
  toItemUpdateInput,
  toTransactionCreateInput
} from './openfinance-reload.utils.js';

export async function reloadOpenFinance(dependencies: ReloadDependencies): Promise<ReloadResult> {
  const {
    itemsRepository,
    accountRepository,
    transactionRepository,
    investmentRepository,
    consentRepository,
    identityRepository,
    loanRepository,
    billRepository,
    pluggyClient,
    logger
  } =
    dependencies;
  const items = await listItems(itemsRepository);

  const itemResults: ReloadResult['items'] = [];
  let totalAccountsFound = 0;
  let totalAccountsSaved = 0;
  let totalInvestmentsFound = 0;
  let totalInvestmentsSaved = 0;
  let totalConsentsFound = 0;
  let totalConsentsSaved = 0;
  let totalIdentitiesFound = 0;
  let totalIdentitiesSaved = 0;
  let totalLoansFound = 0;
  let totalLoansSaved = 0;
  let totalBillsFound = 0;
  let totalBillsSaved = 0;

  for (const item of items) {
    const pluggyItem = await pluggyClient.fetchItem(item.id);
    const itemUpdateInput = toItemUpdateInput(pluggyItem);
    await itemsRepository.updateById(item.id, itemUpdateInput);

    logger.info('openfinance.reload.item_updated', {
      itemId: item.id,
      item: itemUpdateInput
    });

    const response = await pluggyClient.fetchAccounts(item.id);
    const rawAccounts = Array.isArray(response.results) ? response.results : [];
    const accounts = rawAccounts.map((account) => normalizePluggyAccount(account, item.id));

    logger.info('openfinance.reload.accounts_listed', {
      itemId: item.id,
      accounts
    });

    let accountsSaved = 0;
    let billsFound = 0;
    let billsSaved = 0;
    for (const account of accounts) {
      const input = toAccountCreateInput(account);
      try {
        await accountRepository.create(input);
      } catch {
        await accountRepository.updateById(input.id, input);
      }
      accountsSaved += 1;

      const hasExistingTransactions = await transactionRepository.existsByAccountId(input.id);
      const transactionsResponse = hasExistingTransactions
        ? await pluggyClient.fetchTransactions(input.id, {
            from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            to: new Date().toISOString()
          })
        : await pluggyClient.fetchTransactions(input.id);
      const rawTransactions = Array.isArray(transactionsResponse.results)
        ? transactionsResponse.results
        : [];
      let transactionsSaved = 0;
      for (const rawTransaction of rawTransactions) {
        const transactionInput = toTransactionCreateInput(rawTransaction, input.id);
        try {
          await transactionRepository.create(transactionInput);
        } catch {
          await transactionRepository.updateById(transactionInput.id, transactionInput);
        }
        transactionsSaved += 1;
      }

      logger.info('openfinance.reload.transactions_listed', {
        itemId: item.id,
        accountId: input.id,
        transactionsFound: rawTransactions.length,
        transactionsSaved
      });

      const billsResponse = await pluggyClient.fetchCreditCardBills(input.id);
      const rawBills = Array.isArray(billsResponse.results) ? billsResponse.results : [];
      for (const rawBill of rawBills) {
        const billInput = toBillCreateInput(rawBill, input.id);
        try {
          await billRepository.create(billInput);
          billsSaved += 1;
        } catch {
          const updated = await billRepository.updateById(billInput.id, billInput);
          if (updated) {
            billsSaved += 1;
          }
        }
      }
      billsFound += rawBills.length;
    }

    logger.info('openfinance.reload.bills_listed', {
      itemId: item.id,
      billsFound,
      billsSaved
    });

    const investmentsResponse = await pluggyClient.fetchInvestments(item.id);
    const rawInvestments = Array.isArray(investmentsResponse.results)
      ? investmentsResponse.results
      : [];
    let investmentsSaved = 0;
    for (const rawInvestment of rawInvestments) {
      const investmentInput = toInvestmentCreateInput(rawInvestment, item.id);
      try {
        await investmentRepository.create(investmentInput);
      } catch {
        await investmentRepository.updateById(investmentInput.id, investmentInput);
      }
      investmentsSaved += 1;
    }

    logger.info('openfinance.reload.investments_listed', {
      itemId: item.id,
      investmentsFound: rawInvestments.length,
      investmentsSaved
    });

    const consentsResponse = await pluggyClient.fetchConsents(item.id);
    const rawConsents = Array.isArray(consentsResponse.results) ? consentsResponse.results : [];
    let consentsSaved = 0;
    for (const rawConsent of rawConsents) {
      const consentInput = toConsentCreateInput(rawConsent, item.id);
      try {
        await consentRepository.create(consentInput);
        consentsSaved += 1;
      } catch {
        const updated = await consentRepository.updateById(consentInput.id, consentInput);
        if (updated) {
          consentsSaved += 1;
        }
      }
    }

    logger.info('openfinance.reload.consents_listed', {
      itemId: item.id,
      consentsFound: rawConsents.length,
      consentsSaved
    });

    const rawIdentity = await pluggyClient.fetchIdentityByItemId(item.id);
    let identitiesFound = 0;
    let identitiesSaved = 0;
    if (rawIdentity && typeof rawIdentity === 'object') {
      identitiesFound = 1;
      const identityInput = toIdentityCreateInput(rawIdentity, item.id);
      try {
        await identityRepository.create(identityInput);
        identitiesSaved = 1;
      } catch {
        const updated = await identityRepository.updateById(identityInput.id, identityInput);
        if (updated) {
          identitiesSaved = 1;
        }
      }
    }

    logger.info('openfinance.reload.identities_listed', {
      itemId: item.id,
      identitiesFound,
      identitiesSaved
    });

    const loansResponse = await pluggyClient.fetchLoans(item.id);
    const rawLoans = Array.isArray(loansResponse.results) ? loansResponse.results : [];
    let loansSaved = 0;
    for (const rawLoan of rawLoans) {
      const loanInput = toLoanCreateInput(rawLoan, item.id);
      try {
        await loanRepository.create(loanInput);
        loansSaved += 1;
      } catch {
        const updated = await loanRepository.updateById(loanInput.id, loanInput);
        if (updated) {
          loansSaved += 1;
        }
      }
    }

    logger.info('openfinance.reload.loans_listed', {
      itemId: item.id,
      loansFound: rawLoans.length,
      loansSaved
    });

    itemResults.push({
      itemId: item.id,
      accountsFound: accounts.length,
      accountsSaved,
      investmentsFound: rawInvestments.length,
      investmentsSaved,
      consentsFound: rawConsents.length,
      consentsSaved,
      identitiesFound,
      identitiesSaved,
      loansFound: rawLoans.length,
      loansSaved,
      billsFound,
      billsSaved
    });
    totalAccountsFound += accounts.length;
    totalAccountsSaved += accountsSaved;
    totalInvestmentsFound += rawInvestments.length;
    totalInvestmentsSaved += investmentsSaved;
    totalConsentsFound += rawConsents.length;
    totalConsentsSaved += consentsSaved;
    totalIdentitiesFound += identitiesFound;
    totalIdentitiesSaved += identitiesSaved;
    totalLoansFound += rawLoans.length;
    totalLoansSaved += loansSaved;
    totalBillsFound += billsFound;
    totalBillsSaved += billsSaved;
  }

  return {
    totalItems: items.length,
    totalAccountsFound,
    totalAccountsSaved,
    totalInvestmentsFound,
    totalInvestmentsSaved,
    totalConsentsFound,
    totalConsentsSaved,
    totalIdentitiesFound,
    totalIdentitiesSaved,
    totalLoansFound,
    totalLoansSaved,
    totalBillsFound,
    totalBillsSaved,
    items: itemResults
  };
}
