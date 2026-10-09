interface WebCrypto {
  randomUUID?: () => string;
  getRandomValues: (array: Uint8Array) => Uint8Array;
}

/**
 * Browser-safe UUID v4. crypto.randomUUID() only exists in secure contexts
 * (HTTPS/localhost) and on Safari 15.4+, so opening the app over plain http
 * on an iPhone would otherwise make every save throw. getRandomValues has
 * no such restriction.
 */
export function newId(): string {
  const crypto = (globalThis as unknown as { crypto: WebCrypto }).crypto;
  if (typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
