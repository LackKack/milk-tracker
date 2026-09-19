import * as Crypto from 'expo-crypto';

import { webDb } from '../db/webDb';
import type { MilkEntry, MonthSummaryDay, NewMilkEntryInput } from '../../models/MilkEntry';
import type { MilkEntryRepository } from './types';

class DexieMilkEntryRepository implements MilkEntryRepository {
  async create(input: NewMilkEntryInput): Promise<MilkEntry> {
    const id = Crypto.randomUUID();
    const now = new Date().toISOString();
    const entry: MilkEntry = { id, ...input, createdAt: now };
    await webDb.milkEntries.put(entry);
    return entry;
  }

  async update(id: string, patch: Partial<NewMilkEntryInput>): Promise<MilkEntry> {
    await webDb.milkEntries.update(id, patch);
    const entry = await webDb.milkEntries.get(id);
    if (!entry) {
      throw new Error(`Milk entry ${id} not found after update`);
    }
    return entry;
  }

  async delete(id: string): Promise<void> {
    await webDb.milkEntries.delete(id);
  }

  async getDailyTotal(childId: string, date: string): Promise<number> {
    const entries = await webDb.milkEntries
      .where('[childId+entryDate]')
      .equals([childId, date])
      .toArray();
    return entries.reduce((sum, e) => sum + e.amountMl, 0);
  }

  async listByDateRange(childId: string, from: string, to: string): Promise<MilkEntry[]> {
    const entries = await webDb.milkEntries
      .where('[childId+entryDate]')
      .between([childId, from], [childId, to], true, true)
      .toArray();
    return entries.sort((a, b) =>
      a.entryDate === b.entryDate
        ? a.entryTime.localeCompare(b.entryTime)
        : a.entryDate.localeCompare(b.entryDate)
    );
  }

  async getMonthSummary(childId: string, yearMonth: string): Promise<MonthSummaryDay[]> {
    const entries = await this.listByDateRange(childId, `${yearMonth}-01`, `${yearMonth}-31`);
    const totals = new Map<string, number>();
    for (const entry of entries) {
      totals.set(entry.entryDate, (totals.get(entry.entryDate) ?? 0) + entry.amountMl);
    }
    return Array.from(totals.entries()).map(([date, totalMl]) => ({ date, totalMl }));
  }
}

export const dexieMilkEntryRepository = new DexieMilkEntryRepository();
