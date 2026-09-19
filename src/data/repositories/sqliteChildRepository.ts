import * as Crypto from 'expo-crypto';

import { getDb } from '../db/client';
import { APP_SETTINGS_KEYS } from '../../lib/constants';
import { getSetting, setSetting } from '../../lib/settingsStore';
import type { Child, NewChildInput } from '../../models/Child';
import type { ChildRepository } from './types';

interface ChildRow {
  id: string;
  name: string;
  date_of_birth: string;
  gender: string;
  avatar_uri: string | null;
  weight_kg: number | null;
  height_cm: number | null;
  created_at: string;
  updated_at: string;
}

function rowToChild(row: ChildRow): Child {
  return {
    id: row.id,
    name: row.name,
    dateOfBirth: row.date_of_birth,
    gender: row.gender as Child['gender'],
    avatarUri: row.avatar_uri,
    weightKg: row.weight_kg,
    heightCm: row.height_cm,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

class SqliteChildRepository implements ChildRepository {
  async getActiveChild(): Promise<Child | null> {
    const activeId = await getSetting(APP_SETTINGS_KEYS.activeChildId);
    if (!activeId) return null;

    const db = await getDb();
    const row = await db.getFirstAsync<ChildRow>('SELECT * FROM children WHERE id = ?', [
      activeId,
    ]);
    return row ? rowToChild(row) : null;
  }

  async createChild(input: NewChildInput): Promise<Child> {
    const db = await getDb();
    const id = Crypto.randomUUID();
    const now = new Date().toISOString();

    await db.runAsync(
      `INSERT INTO children
        (id, name, date_of_birth, gender, avatar_uri, weight_kg, height_cm, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        input.name,
        input.dateOfBirth,
        input.gender,
        input.avatarUri,
        input.weightKg,
        input.heightCm,
        now,
        now,
      ]
    );

    await setSetting(APP_SETTINGS_KEYS.activeChildId, id);

    return {
      id,
      name: input.name,
      dateOfBirth: input.dateOfBirth,
      gender: input.gender,
      avatarUri: input.avatarUri,
      weightKg: input.weightKg,
      heightCm: input.heightCm,
      createdAt: now,
      updatedAt: now,
    };
  }

  async updateChild(id: string, patch: Partial<NewChildInput>): Promise<Child> {
    const db = await getDb();
    const now = new Date().toISOString();

    const fieldMap: Record<string, unknown> = {
      name: patch.name,
      date_of_birth: patch.dateOfBirth,
      gender: patch.gender,
      avatar_uri: patch.avatarUri,
      weight_kg: patch.weightKg,
      height_cm: patch.heightCm,
    };

    const columns = Object.keys(fieldMap).filter((key) => fieldMap[key] !== undefined);
    const setClauses = [...columns.map((col) => `${col} = ?`), 'updated_at = ?'];
    const values = [...columns.map((col) => fieldMap[col]), now, id];

    await db.runAsync(
      `UPDATE children SET ${setClauses.join(', ')} WHERE id = ?`,
      values as (string | number | null)[]
    );

    const row = await db.getFirstAsync<ChildRow>('SELECT * FROM children WHERE id = ?', [id]);
    if (!row) {
      throw new Error(`Child ${id} not found after update`);
    }
    return rowToChild(row);
  }
}

export const sqliteChildRepository = new SqliteChildRepository();
