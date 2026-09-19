import { sqliteChildRepository } from './sqliteChildRepository';
import { sqliteMilkEntryRepository } from './sqliteMilkEntryRepository';
import type { ChildRepository, MilkEntryRepository } from './types';

// Single swap point: when a real backend exists, point these at
// httpChildRepository / httpMilkEntryRepository instead. No other file in
// the app should import a concrete repository implementation directly.
export const childRepository: ChildRepository = sqliteChildRepository;
export const milkEntryRepository: MilkEntryRepository = sqliteMilkEntryRepository;

export type { ChildRepository, MilkEntryRepository } from './types';
