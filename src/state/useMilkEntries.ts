import { useCallback } from 'react';

import { milkEntryRepository } from '../data/repositories';
import type { NewMilkEntryInput } from '../models/MilkEntry';

/** Mutations for milk entries. Callers are responsible for refetching any views they rely on. */
export function useMilkEntries() {
  const createEntry = useCallback((input: NewMilkEntryInput) => {
    return milkEntryRepository.create(input);
  }, []);

  const updateEntry = useCallback((id: string, patch: Partial<NewMilkEntryInput>) => {
    return milkEntryRepository.update(id, patch);
  }, []);

  const deleteEntry = useCallback((id: string) => {
    return milkEntryRepository.delete(id);
  }, []);

  return { createEntry, updateEntry, deleteEntry };
}
