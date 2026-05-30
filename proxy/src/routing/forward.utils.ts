export function buildForwardUrl(backendBaseUrl: string, requestUrl: string): string {
  const incoming = new URL(requestUrl);
  const target = new URL(backendBaseUrl);
  target.pathname = incoming.pathname;
  target.search = incoming.search;
  return target.toString();
}
