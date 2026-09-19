// Web implementation: localStorage is simple, synchronous under the hood,
// and needs none of expo-sqlite's cross-origin-isolation setup, unlike the
// native version which reads/writes the app_settings SQLite table.
export async function getSetting(key: string): Promise<string | null> {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export async function setSetting(key: string, value: string): Promise<void> {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Ignore write failures (e.g. private browsing storage restrictions).
  }
}
