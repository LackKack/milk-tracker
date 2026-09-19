import type { MilkType } from './MilkType';

export interface MilkEntry {
  id: string;
  childId: string;
  amountMl: number;
  milkType: MilkType;
  entryDate: string; // 'YYYY-MM-DD'
  entryTime: string; // 'HH:mm'
  notes: string | null;
  createdAt: string; // ISO datetime
}

export interface NewMilkEntryInput {
  childId: string;
  amountMl: number;
  milkType: MilkType;
  entryDate: string;
  entryTime: string;
  notes: string | null;
}

export interface MonthSummaryDay {
  date: string; // 'YYYY-MM-DD'
  totalMl: number;
}
