import Dexie, { Table } from 'dexie';

import type { Child } from '../../models/Child';
import type { MilkEntry } from '../../models/MilkEntry';

class MilkTrackerWebDb extends Dexie {
  children!: Table<Child, string>;
  milkEntries!: Table<MilkEntry, string>;

  constructor() {
    super('milk-tracker');
    this.version(1).stores({
      children: 'id',
      milkEntries: 'id, childId, entryDate, [childId+entryDate]',
    });
  }
}

export const webDb = new MilkTrackerWebDb();
