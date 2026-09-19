import { dexieChildRepository } from './dexieChildRepository';
import { dexieMilkEntryRepository } from './dexieMilkEntryRepository';
import type { ChildRepository, MilkEntryRepository } from './types';

// Web swap point: expo-sqlite's web backend needs cross-origin-isolation
// headers on the document response that aren't reliably available from the
// local dev server, and is alpha-status upstream. The web build persists to
// IndexedDB via Dexie instead; native keeps SQLite (see ./index.ts). Same
// interfaces either way, so no UI/hook code differs by platform.
export const childRepository: ChildRepository = dexieChildRepository;
export const milkEntryRepository: MilkEntryRepository = dexieMilkEntryRepository;

export type { ChildRepository, MilkEntryRepository } from './types';
