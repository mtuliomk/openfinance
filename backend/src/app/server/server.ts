import { createServer } from 'node:http';
import '../../shared/env/load-env.js';

import {
  createAccount,
  deleteAccountById,
  getAccountById,
  listAccount,
  updateAccountById
} from '../../modules/account/account.js';
import {
  accountCreateSchema,
  accountIdSchema,
  accountUpdateSchema
} from '../../modules/account/account.utils.js';
import { getItemById, listItems, updateItemById } from '../../modules/items/items.js';
import { itemIdSchema, itemUpdateSchema } from '../../modules/items/items.utils.js';
import { reloadOpenFinance } from '../../modules/openfinance-reload/openfinance-reload.js';
import { getHealthFromQuery } from '../../modules/health/health.js';
import { accountRepository } from '../../infra/database/turso/repositories/account-repository.js';
import { itemsRepository } from '../../infra/database/turso/repositories/items-repository.js';
import { transactionRepository } from '../../infra/database/turso/repositories/transaction-repository.js';
import { getTransactionById, listTransaction } from '../../modules/transaction/transaction.js';
import { transactionIdSchema } from '../../modules/transaction/transaction.utils.js';
import { investmentRepository } from '../../infra/database/turso/repositories/investment-repository.js';
import { getInvestmentById, listInvestment } from '../../modules/investment/investment.js';
import { investmentIdSchema } from '../../modules/investment/investment.utils.js';
import { consentRepository } from '../../infra/database/turso/repositories/consent-repository.js';
import { getConsentById, listConsent } from '../../modules/consent/consent.js';
import { consentIdSchema } from '../../modules/consent/consent.utils.js';
import { identityRepository } from '../../infra/database/turso/repositories/identity-repository.js';
import { getIdentityById, listIdentity } from '../../modules/identity/identity.js';
import { identityIdSchema } from '../../modules/identity/identity.utils.js';
import { loanRepository } from '../../infra/database/turso/repositories/loan-repository.js';
import { getLoanById, listLoan } from '../../modules/loan/loan.js';
import { loanIdSchema } from '../../modules/loan/loan.utils.js';
import { billRepository } from '../../infra/database/turso/repositories/bill-repository.js';
import { getBillById, listBill } from '../../modules/bill/bill.js';
import { billIdSchema } from '../../modules/bill/bill.utils.js';
import { getResponseLogBody, writeServerJson } from '../shared/http-response.js';
import { PluggyClient } from 'pluggy-sdk';
import { validateProxySignature } from '../../modules/proxy-auth/proxy-auth.js';
import { buildGoogleAuthorizeUrl, exchangeGoogleCode } from '../../modules/auth-google/auth-google.js';
import { googleCallbackQuerySchema, googleStartQuerySchema } from '../../modules/auth-google/auth-google.utils.js';

const REDACTED_HEADERS = new Set(['authorization', 'cookie', 'set-cookie', 'x-proxy-auth']);

function sanitizeHeaders(headers: Record<string, string | string[] | undefined>): Record<string, string> {
  const sanitized: Record<string, string> = {};

  for (const [key, value] of Object.entries(headers)) {
    if (value === undefined) {
      continue;
    }

    if (REDACTED_HEADERS.has(key.toLowerCase())) {
      sanitized[key] = '[REDACTED]';
      continue;
    }

    sanitized[key] = Array.isArray(value) ? value.join(',') : value;
  }

  return sanitized;
}

async function readRequestBody(request: RequestLike): Promise<unknown> {
  let body = '';
  for await (const chunk of request) body += chunk;
  return body ? JSON.parse(body) : {};
}

type RequestLike = AsyncIterable<Buffer | string>;

function createPluggyClient(): PluggyClient {
  const clientId = process.env.PLUGGY_CLIENT_ID;
  const clientSecret = process.env.PLUGGY_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error('Pluggy credentials are not configured');
  }

  return new PluggyClient({ clientId, clientSecret });
}

const server = createServer(async (request, response) => {
  const startedAtMs = Date.now();
  const requestId = crypto.randomUUID();
  const method = request.method ?? 'UNKNOWN';
  const url = new URL(request.url ?? '/', 'http://localhost');
  const requestPath = `${url.pathname}${url.search}`;
  const correlationIdHeader = request.headers['x-correlation-id'];
  const correlationId = Array.isArray(correlationIdHeader) ? correlationIdHeader[0] : correlationIdHeader;
  response.setHeader('x-request-id', requestId);
  response.on('finish', () => {
    const durationMs = Date.now() - startedAtMs;
    const responseHeaders = response.getHeaders();
    const sanitizedResponseHeaders: Record<string, string> = {};
    for (const [key, value] of Object.entries(responseHeaders)) {
      if (value === undefined) {
        continue;
      }

      if (REDACTED_HEADERS.has(key.toLowerCase())) {
        sanitizedResponseHeaders[key] = '[REDACTED]';
        continue;
      }

      sanitizedResponseHeaders[key] = Array.isArray(value)
        ? value.map((item) => String(item)).join(',')
        : String(value);
    }

    console.info('access_log', {
      requestId,
      correlationId: correlationId ?? null,
      request: {
        method,
        path: requestPath,
        query: Object.fromEntries(url.searchParams.entries()),
        headers: sanitizeHeaders(request.headers),
        bodyBytes: Number(request.headers['content-length'] ?? 0)
      },
      response: {
        statusCode: response.statusCode,
        headers: sanitizedResponseHeaders,
        bodyBytes: Number(response.getHeader('content-length') ?? 0),
        body: getResponseLogBody(response) ?? null
      },
      durationMs,
      timestamp: new Date().toISOString()
    });
  });

  const proxySecret = process.env.PROXY_SIGNING_SECRET;
  const backendAudience = process.env.BACKEND_AUDIENCE ?? `http://localhost:${process.env.PORT ?? '3002'}`;
  const isAuthRoute = url.pathname === '/auth/google/start' || url.pathname === '/auth/google/callback';
  const isHealthRoute = url.pathname === '/health';

  if (!isHealthRoute && !isAuthRoute) {
    if (!proxySecret) {
      writeServerJson(response, 500, { error: 'Proxy signing secret not configured' });
      return;
    }

    const isValidProxyRequest = validateProxySignature(
      Array.isArray(request.headers['x-proxy-auth'])
        ? request.headers['x-proxy-auth'][0]
        : request.headers['x-proxy-auth'],
      proxySecret,
      backendAudience
    );
    if (!isValidProxyRequest) {
      writeServerJson(response, 401, { error: 'Invalid proxy authentication' });
      return;
    }
  }

  if (request.method === 'GET' && url.pathname === '/health') {
    try {
      writeServerJson(response, 200, getHealthFromQuery(url.searchParams));
      return;
    } catch {
      writeServerJson(response, 400, { error: 'Invalid request input' });
      return;
    }
  }

  if (request.method === 'GET' && url.pathname === '/auth/google/start') {
    try {
      const clientId = process.env.GOOGLE_CLIENT_ID;
      const redirectUri = process.env.GOOGLE_REDIRECT_URI;
      const frontendCallbackUrl = process.env.FRONTEND_CALLBACK_URL ?? 'http://localhost:3000/auth/callback';
      if (!clientId || !redirectUri) {
        writeServerJson(response, 500, { error: 'Google OAuth not configured' });
        return;
      }

      const { returnTo } = googleStartQuerySchema.parse({
        returnTo: url.searchParams.get('returnTo') ?? undefined
      });
      const { url: authorizeUrl, state } = buildGoogleAuthorizeUrl({
        returnTo,
        clientId,
        redirectUri,
        frontendCallbackUrl
      });
      response.setHeader(
        'set-cookie',
        `google_oauth_state=${state}; HttpOnly; Path=/; SameSite=Lax; Max-Age=600`
      );
      response.writeHead(302, { location: authorizeUrl });
      response.end();
      return;
    } catch {
      writeServerJson(response, 400, { error: 'Invalid request input' });
      return;
    }
  }

  if (request.method === 'GET' && url.pathname === '/auth/google/callback') {
    try {
      const clientId = process.env.GOOGLE_CLIENT_ID;
      const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
      const redirectUri = process.env.GOOGLE_REDIRECT_URI;
      if (!clientId || !clientSecret || !redirectUri) {
        writeServerJson(response, 500, { error: 'Google OAuth not configured' });
        return;
      }

      const parsed = googleCallbackQuerySchema.parse({
        code: url.searchParams.get('code'),
        state: url.searchParams.get('state')
      });
      const cookieHeader = request.headers.cookie ?? '';
      const stateCookie = cookieHeader
        .split(';')
        .map((cookie) => cookie.trim())
        .find((cookie) => cookie.startsWith('google_oauth_state='))
        ?.split('=')[1];

      let decodedState: { nonce: string; returnTo: string; frontendCallbackUrl: string } | null = null;
      try {
        decodedState = JSON.parse(Buffer.from(parsed.state, 'base64url').toString('utf-8')) as {
          nonce: string;
          returnTo: string;
          frontendCallbackUrl: string;
        };
      } catch {
        decodedState = null;
      }

      if (!stateCookie || !decodedState || stateCookie !== decodedState.nonce) {
        writeServerJson(response, 401, { error: 'Invalid oauth state' });
        return;
      }

      const user = await exchangeGoogleCode({
        code: parsed.code,
        state: parsed.state,
        clientId,
        clientSecret,
        redirectUri
      });

      response.setHeader('set-cookie', [
        'google_oauth_state=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0',
        `session_user=${Buffer.from(JSON.stringify(user)).toString('base64')}; HttpOnly; Path=/; SameSite=Lax; Max-Age=86400`
      ]);
      const callbackUrl = new URL(decodedState.returnTo, decodedState.frontendCallbackUrl);
      callbackUrl.searchParams.set('success', '1');
      callbackUrl.searchParams.set('name', user.name);
      callbackUrl.searchParams.set('avatar', user.picture);
      callbackUrl.searchParams.set('email', user.email);
      response.writeHead(302, { location: callbackUrl.toString() });
      response.end();
      return;
    } catch {
      writeServerJson(response, 400, { error: 'Unable to authenticate with Google' });
      return;
    }
  }

  if (request.method === 'POST' && url.pathname === '/account') {
    try {
      const input = accountCreateSchema.parse(await readRequestBody(request));
      writeServerJson(response, 201, await createAccount(accountRepository, input));
      return;
    } catch {
      writeServerJson(response, 400, { error: 'Invalid request input' });
      return;
    }
  }

  if (request.method === 'GET' && url.pathname === '/account') {
    writeServerJson(response, 200, await listAccount(accountRepository));
    return;
  }

  if (request.method === 'GET' && url.pathname.startsWith('/account/')) {
    try {
      const id = accountIdSchema.parse(url.pathname.split('/')[2]);
      const payload = await getAccountById(accountRepository, id);
      if (!payload) return writeServerJson(response, 404, { error: 'Account not found' });
      writeServerJson(response, 200, payload);
      return;
    } catch {
      writeServerJson(response, 400, { error: 'Invalid request input' });
      return;
    }
  }

  if (request.method === 'PUT' && url.pathname.startsWith('/account/')) {
    try {
      const id = accountIdSchema.parse(url.pathname.split('/')[2]);
      const input = accountUpdateSchema.parse(await readRequestBody(request));
      const payload = await updateAccountById(accountRepository, id, input);
      if (!payload) return writeServerJson(response, 404, { error: 'Account not found' });
      writeServerJson(response, 200, payload);
      return;
    } catch {
      writeServerJson(response, 400, { error: 'Invalid request input' });
      return;
    }
  }

  if (request.method === 'DELETE' && url.pathname.startsWith('/account/')) {
    try {
      const id = accountIdSchema.parse(url.pathname.split('/')[2]);
      const deleted = await deleteAccountById(accountRepository, id);
      if (!deleted) return writeServerJson(response, 404, { error: 'Account not found' });
      writeServerJson(response, 204, null);
      return;
    } catch {
      writeServerJson(response, 400, { error: 'Invalid request input' });
      return;
    }
  }

  if (request.method === 'GET' && url.pathname === '/items') {
    writeServerJson(response, 200, await listItems(itemsRepository));
    return;
  }

  if (request.method === 'GET' && url.pathname.startsWith('/items/')) {
    try {
      const id = itemIdSchema.parse(url.pathname.split('/')[2]);
      const payload = await getItemById(itemsRepository, id);
      if (!payload) return writeServerJson(response, 404, { error: 'Item not found' });
      writeServerJson(response, 200, payload);
      return;
    } catch {
      writeServerJson(response, 400, { error: 'Invalid request input' });
      return;
    }
  }

  if (request.method === 'PUT' && url.pathname.startsWith('/items/')) {
    try {
      const id = itemIdSchema.parse(url.pathname.split('/')[2]);
      const input = itemUpdateSchema.parse(await readRequestBody(request));
      const payload = await updateItemById(itemsRepository, id, input);
      if (!payload) return writeServerJson(response, 404, { error: 'Item not found' });
      writeServerJson(response, 200, payload);
      return;
    } catch {
      writeServerJson(response, 400, { error: 'Invalid request input' });
      return;
    }
  }

  if (request.method === 'POST' && url.pathname === '/openfinance/reload') {
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

      writeServerJson(response, 200, payload);
      return;
    } catch (error) {
      console.error('openfinance.reload.failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      writeServerJson(response, 400, { error: 'Unable to reload openfinance accounts' });
      return;
    }
  }

  if (request.method === 'GET' && url.pathname === '/transaction') {
    writeServerJson(response, 200, await listTransaction(transactionRepository));
    return;
  }

  if (request.method === 'GET' && url.pathname === '/investment') {
    writeServerJson(response, 200, await listInvestment(investmentRepository));
    return;
  }

  if (request.method === 'GET' && url.pathname.startsWith('/investment/')) {
    try {
      const id = investmentIdSchema.parse(url.pathname.split('/')[2]);
      const payload = await getInvestmentById(investmentRepository, id);
      if (!payload) return writeServerJson(response, 404, { error: 'Investment not found' });
      writeServerJson(response, 200, payload);
      return;
    } catch {
      writeServerJson(response, 400, { error: 'Invalid request input' });
      return;
    }
  }

  if (request.method === 'GET' && url.pathname === '/consent') {
    writeServerJson(response, 200, await listConsent(consentRepository));
    return;
  }

  if (request.method === 'GET' && url.pathname.startsWith('/consent/')) {
    try {
      const id = consentIdSchema.parse(url.pathname.split('/')[2]);
      const payload = await getConsentById(consentRepository, id);
      if (!payload) return writeServerJson(response, 404, { error: 'Consent not found' });
      writeServerJson(response, 200, payload);
      return;
    } catch {
      writeServerJson(response, 400, { error: 'Invalid request input' });
      return;
    }
  }

  if (request.method === 'GET' && url.pathname === '/identity') {
    writeServerJson(response, 200, await listIdentity(identityRepository));
    return;
  }

  if (request.method === 'GET' && url.pathname.startsWith('/identity/')) {
    try {
      const id = identityIdSchema.parse(url.pathname.split('/')[2]);
      const payload = await getIdentityById(identityRepository, id);
      if (!payload) return writeServerJson(response, 404, { error: 'Identity not found' });
      writeServerJson(response, 200, payload);
      return;
    } catch {
      writeServerJson(response, 400, { error: 'Invalid request input' });
      return;
    }
  }

  if (request.method === 'GET' && url.pathname === '/loan') {
    writeServerJson(response, 200, await listLoan(loanRepository));
    return;
  }

  if (request.method === 'GET' && url.pathname.startsWith('/loan/')) {
    try {
      const id = loanIdSchema.parse(url.pathname.split('/')[2]);
      const payload = await getLoanById(loanRepository, id);
      if (!payload) return writeServerJson(response, 404, { error: 'Loan not found' });
      writeServerJson(response, 200, payload);
      return;
    } catch {
      writeServerJson(response, 400, { error: 'Invalid request input' });
      return;
    }
  }

  if (request.method === 'GET' && url.pathname === '/bill') {
    writeServerJson(response, 200, await listBill(billRepository));
    return;
  }

  if (request.method === 'GET' && url.pathname.startsWith('/bill/')) {
    try {
      const id = billIdSchema.parse(url.pathname.split('/')[2]);
      const payload = await getBillById(billRepository, id);
      if (!payload) return writeServerJson(response, 404, { error: 'Bill not found' });
      writeServerJson(response, 200, payload);
      return;
    } catch {
      writeServerJson(response, 400, { error: 'Invalid request input' });
      return;
    }
  }

  if (request.method === 'GET' && url.pathname.startsWith('/transaction/')) {
    try {
      const id = transactionIdSchema.parse(url.pathname.split('/')[2]);
      const payload = await getTransactionById(transactionRepository, id);
      if (!payload) return writeServerJson(response, 404, { error: 'Transaction not found' });
      writeServerJson(response, 200, payload);
      return;
    } catch {
      writeServerJson(response, 400, { error: 'Invalid request input' });
      return;
    }
  }

  writeServerJson(response, 404, { error: 'Not found' });
});

const port = Number(process.env.PORT ?? 3001);
server.listen(port);
