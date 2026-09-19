import * as Crypto from 'expo-crypto';

import { getDb } from '../db/client';
import type { MilkEntry, MonthSummaryDay, NewMilkEntryInput } from '../../models/MilkEntry';
import type { MilkEntryRepository } from './types';

interface MilkEntryRow {
  id: string;
  child_id: string;
  amount_ml: number;
  milk_type: string;
  entry_date: string;
  entry_time: string;
  notes: string | null;
  created_at: string;
}

function rowToEntry(row: MilkEntryRow): MilkEntry {
  return {
    id: row.id,
    childId: row.child_id,
    amountMl: row.amount_ml,
    milkType: row.milk_type as MilkEntry['milkType'],
    entryDate: row.entry_date,
    entryTime: row.entry_time,
    notes: row.notes,
    createdAt: row.created_at,
  };
}

class SqliteMilkEntryRepository implements MilkEntryRepository {
  async create(input: NewMilkEntryInput): Promise<MilkEntry> {
    const db = await getDb();
    const id = Crypto.randomUUID();
    const now = new Date().toISOString();

    await db.runAsync(
      `INSERT INTO milk_entries
        (id, child_id, amount_ml, milk_type, entry_date, entry_time, notes, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        input.childId,
        input.amountMl,
        input.milkType,
        input.entryDate,
        input.entryTime,
        input.notes,
        now,
      ]
    );

    return {
      id,
      childId: input.childId,
      amountMl: input.amountMl,
      milkType: input.milkType,
      entryDate: input.entryDate,
      entryTime: input.entryTime,
      notes: input.notes,
      createdAt: now,
    };
  }

  async update(id: string, patch: Partial<NewMilkEntryInput>): Promise<MilkEntry> {
    const db = await getDb();

    const fieldMap: Record<string, unknown> = {
      amount_ml: patch.amountMl,
      milk_type: patch.milkType,
      entry_date: patch.entryDate,
      entry_time: patch.entryTime,
      notes: patch.notes,
    };

    const columns = Object.keys(fieldMap).filter((key) => fieldMap[key] !== undefined);
    const setClauses = columns.map((col) => `${col} = ?`);
    const values = [...columns.map((col) => fieldMap[col]), id];

    if (setClauses.length > 0) {
      await db.runAsync(
        `UPDATE milk_entries SET ${setClauses.join(', ')} WHERE id = ?`,
        values as (string | number | null)[]
      );
    }

    const row = await db.getFirstAsync<MilkEntryRow>(
      'SELECT * FROM milk_entries WHERE id = ?',
      [id]
    );
    if (!row) {
      throw new Error(`Milk entry ${id} not found after update`);
    }
    return rowToEntry(row);
  }

  async delete(id: string): Promise<void> {
    const db = await getDb();
    await db.runAsync('DELETE FROM milk_entries WHERE id = ?', [id]);
  }

  async getDailyTotal(childId: string, date: string): Promise<number> {
    const db = await getDb();
    const row = await db.getFirstAsync<{ total: number }>(
      'SELECT COALESCE(SUM(amount_ml), 0) AS total FROM milk_entries WHERE child_id = ? AND entry_date = ?',
      [childId, date]
    );
    return row?.total ?? 0;
  }

  async listByDateRange(childId: string, from: string, to: string): Promise<MilkEntry[]> {
    const db = await getDb();
    const rows = await db.getAllAsync<MilkEntryRow>(
      `SELECT * FROM milk_entries
       WHERE child_id = ? AND entry_date BETWEEN ? AND ?
       ORDER BY entry_date ASC, entry_time ASC`,
      [childId, from, to]
    );
    return rows.map(rowToEntry);
  }

  async getMonthSummary(childId: string, yearMonth: string): Promise<MonthSummaryDay[]> {
    const db = await getDb();
    const from = `${yearMonth}-01`;
    const rows = await db.getAllAsync<{ entry_date: string; total_ml: number }>(
      `SELECT entry_date, SUM(amount_ml) AS total_ml
       FROM milk_entries
       WHERE child_id = ? AND entry_date >= ? AND entry_date < date(?, '+1 month')
       GROUP BY entry_date`,
      [childId, from, from]
    );
    return rows.map((row) => ({ date: row.entry_date, totalMl: row.total_ml }));
  }
}

export const sqliteMilkEntryRepository = new SqliteMilkEntryRepository();
