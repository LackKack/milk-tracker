import type { SQLiteDatabase } from 'expo-sqlite';

import { CREATE_TABLES_SQL } from './schema';

interface Migration {
  version: number;
  run: (db: SQLiteDatabase) => Promise<void>;
}

// Append new migrations here as the schema evolves; each runs at most once,
// in order, tracked via the app_settings.schemaVersion row.
const MIGRATIONS: Migration[] = [
  {
    version: 1,
    run: async (db) => {
      await db.execAsync(CREATE_TABLES_SQL);
    },
  },
];

export async function runMigrations(db: SQLiteDatabase): Promise<void> {
  // The schema itself must exist before we can read app_settings for the
  // current version, so the base CREATE TABLE statements are safe to run
  // unconditionally (they're all IF NOT EXISTS).
  await db.execAsync(CREATE_TABLES_SQL);

  const row = await db.getFirstAsync<{ value: string }>(
    'SELECT value FROM app_settings WHERE key = ?',
    ['schemaVersion']
  );
  const currentVersion = row ? Number(row.value) : 0;

  const pending = MIGRATIONS.filter((m) => m.version > currentVersion).sort(
    (a, b) => a.version - b.version
  );

  for (const migration of pending) {
    await migration.run(db);
    await db.runAsync(
      'INSERT INTO app_settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
      ['schemaVersion', String(migration.version)]
    );
  }
}
