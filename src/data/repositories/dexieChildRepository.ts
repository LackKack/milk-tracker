import * as Crypto from 'expo-crypto';

import { webDb } from '../db/webDb';
import { APP_SETTINGS_KEYS } from '../../lib/constants';
import { getSetting, setSetting } from '../../lib/settingsStore';
import type { Child, NewChildInput } from '../../models/Child';
import type { ChildRepository } from './types';

class DexieChildRepository implements ChildRepository {
  async getActiveChild(): Promise<Child | null> {
    const activeId = await getSetting(APP_SETTINGS_KEYS.activeChildId);
    if (!activeId) return null;
    const child = await webDb.children.get(activeId);
    return child ?? null;
  }

  async createChild(input: NewChildInput): Promise<Child> {
    const id = Crypto.randomUUID();
    const now = new Date().toISOString();
    const child: Child = { id, ...input, createdAt: now, updatedAt: now };
    await webDb.children.put(child);
    await setSetting(APP_SETTINGS_KEYS.activeChildId, id);
    return child;
  }

  async updateChild(id: string, patch: Partial<NewChildInput>): Promise<Child> {
    const now = new Date().toISOString();
    await webDb.children.update(id, { ...patch, updatedAt: now });
    const child = await webDb.children.get(id);
    if (!child) {
      throw new Error(`Child ${id} not found after update`);
    }
    return child;
  }
}

export const dexieChildRepository = new DexieChildRepository();
