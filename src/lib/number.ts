/**
 * Parses a user-typed number, tolerating a comma as the decimal separator.
 * Some iOS locales render the native numeric keyboard with a comma instead
 * of a dot (e.g. "7,2"), which JS's Number() can't parse on its own —
 * without this it silently returns NaN and the value fails to save.
 * Returns null for empty/invalid input rather than NaN, so callers never
 * accidentally persist an unparseable value.
 */
export function parseOptionalDecimal(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = Number(trimmed.replace(',', '.'));
  return Number.isNaN(parsed) ? null : parsed;
}
