import type { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2 } from 'aws-lambda';
import { PluggyClient } from 'pluggy-sdk';
import '../../shared/env/load-env.js';

import { accountRepository } from '../../infra/database/turso/repositories/account-repository.js';
import { billRepository } from '../../infra/database/turso/repositories/bill-repository.js';
import { consentRepository } from '../../infra/database/turso/repositories/consent-repository.js';
import { identityRepository } from '../../infra/database/turso/repositories/identity-repository.js';
import { investmentRepository } from '../../infra/database/turso/repositories/investment-repository.js';
import { loanRepository } from '../../infra/database/turso/repositories/loan-repository.js';
import { itemsRepository } from '../../infra/database/turso/repositories/items-repository.js';
import { transactionRepository } from '../../infra/database/turso/repositories/transaction-repository.js';
import { reloadOpenFinance } from '../../modules/openfinance-reload/openfinance-reload.js';
import { toLambdaJson } from '../shared/http-response.js';

function createPluggyClient(): PluggyClient {
  const clientId = process.env.PLUGGY_CLIENT_ID;
  const clientSecret = process.env.PLUGGY_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error('Pluggy credentials are not configured');
  }

  return new PluggyClient({ clientId, clientSecret });
}

export async function handler(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyStructuredResultV2> {
  const method = event.requestContext.http.method;

  if (method !== 'POST') {
    return toLambdaJson(404, { error: 'Not found' });
  }

  try {
    const payload = await reloadOpenFinance({
      itemsRepository,
      accountRepository,
      transactionRepository,
      investmentRepository,
      consentRepository,
      identityRepository,
      loanRepository,
      billRepository,
      pluggyClient: createPluggyClient(),
      logger: {
        info(message, context) {
          console.info(message, context);
        }
      }
    });

    return toLambdaJson(200, payload);
  } catch (error) {
    console.error('openfinance.reload.failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return toLambdaJson(400, { error: 'Unable to reload openfinance accounts' });
  }
}
