import type { Child, NewChildInput } from '../../models/Child';
import type { MilkEntry, MonthSummaryDay, NewMilkEntryInput } from '../../models/MilkEntry';

/**
 * Storage-agnostic contracts for reading/writing child profiles and milk
 * entries. UI code and hooks depend only on these interfaces (imported via
 * ./index), never on a concrete implementation — today's SQLite-backed
 * implementation can be swapped for an HTTP client against a future backend
 * without any caller changes.
 */
export interface ChildRepository {
  getActiveChild(): Promise<Child | null>;
  createChild(input: NewChildInput): Promise<Child>;
  updateChild(id: string, patch: Partial<NewChildInput>): Promise<Child>;
}

export interface MilkEntryRepository {
  create(input: NewMilkEntryInput): Promise<MilkEntry>;
  update(id: string, patch: Partial<NewMilkEntryInput>): Promise<MilkEntry>;
  delete(id: string): Promise<void>;
  getDailyTotal(childId: string, date: string): Promise<number>;
  listByDateRange(childId: string, from: string, to: string): Promise<MilkEntry[]>;
  getMonthSummary(childId: string, yearMonth: string): Promise<MonthSummaryDay[]>;
}
