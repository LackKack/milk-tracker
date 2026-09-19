import * as SQLite from 'expo-sqlite';

import { DB_NAME } from '../../lib/constants';
import { runMigrations } from './migrations';

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

/** Returns the singleton database handle, opening it and running migrations on first call. */
export function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = (async () => {
      const db = await SQLite.openDatabaseAsync(DB_NAME);
      await runMigrations(db);
      return db;
    })();
  }
  return dbPromise;
}
