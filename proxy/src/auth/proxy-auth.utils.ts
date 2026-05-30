const TTL_SECONDS = 60;

export function toBase64Url(value: string): string {
  return btoa(value).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function fromBytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes).map((item) => item.toString(16).padStart(2, '0')).join('');
}

export function buildExpiry(nowSeconds: number): number {
  return nowSeconds + TTL_SECONDS;
}
