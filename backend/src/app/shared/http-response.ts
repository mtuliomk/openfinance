import type { APIGatewayProxyStructuredResultV2 } from 'aws-lambda';
import type { ServerResponse } from 'node:http';

const RESPONSE_LOG_BODY_KEY = '__responseLogBody';

export function toLambdaJson(
  statusCode: number,
  body: unknown
): APIGatewayProxyStructuredResultV2 {
  return {
    statusCode,
    headers: {
      'content-type': 'application/json; charset=utf-8'
    },
    body: JSON.stringify(body)
  };
}

export function writeServerJson(response: ServerResponse, statusCode: number, body: unknown): void {
  (response as ServerResponse & { [RESPONSE_LOG_BODY_KEY]?: unknown })[RESPONSE_LOG_BODY_KEY] = body;
  response.writeHead(statusCode, { 'content-type': 'application/json; charset=utf-8' });
  response.end(
    JSON.stringify({
      statusCode,
      body
    })
  );
}

export function getResponseLogBody(response: ServerResponse): unknown {
  return (response as ServerResponse & { [RESPONSE_LOG_BODY_KEY]?: unknown })[RESPONSE_LOG_BODY_KEY];
}
