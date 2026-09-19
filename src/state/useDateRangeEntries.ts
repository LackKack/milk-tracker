import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import { milkEntryRepository } from '../data/repositories';
import type { MilkEntry } from '../models/MilkEntry';

export function useDateRangeEntries(childId: string | undefined, from: string, to: string) {
  const [entries, setEntries] = useState<MilkEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refetch = useCallback(async () => {
    if (!childId) return;
    setIsLoading(true);
    try {
      const results = await milkEntryRepository.listByDateRange(childId, from, to);
      setEntries(results);
    } finally {
      setIsLoading(false);
    }
  }, [childId, from, to]);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  return { entries, isLoading, refetch };
}
