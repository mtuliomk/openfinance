import type { APIGatewayProxyStructuredResultV2 } from 'aws-lambda';
import type { ServerResponse } from 'node:http';

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
  response.writeHead(statusCode, { 'content-type': 'application/json; charset=utf-8' });
  response.end(
    JSON.stringify({
      statusCode,
      body
    })
  );
}
