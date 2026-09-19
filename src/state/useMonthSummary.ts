import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import { milkEntryRepository } from '../data/repositories';
import type { MonthSummaryDay } from '../models/MilkEntry';

export function useMonthSummary(childId: string | undefined, yearMonth: string) {
  const [days, setDays] = useState<MonthSummaryDay[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refetch = useCallback(async () => {
    if (!childId) return;
    setIsLoading(true);
    try {
      const results = await milkEntryRepository.getMonthSummary(childId, yearMonth);
      setDays(results);
    } finally {
      setIsLoading(false);
    }
  }, [childId, yearMonth]);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  return { days, isLoading, refetch };
}
