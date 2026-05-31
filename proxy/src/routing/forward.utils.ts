export function buildForwardUrl(upstreamUrl: string, requestUrl: string): string {
  const incoming = new URL(requestUrl);
  const target = new URL(upstreamUrl);
  target.search = incoming.search;
  return target.toString();
}
