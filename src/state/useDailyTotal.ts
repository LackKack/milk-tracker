import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import { milkEntryRepository } from '../data/repositories';

export function useDailyTotal(childId: string | undefined, date: string) {
  const [totalMl, setTotalMl] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const refetch = useCallback(async () => {
    if (!childId) return;
    setIsLoading(true);
    try {
      const total = await milkEntryRepository.getDailyTotal(childId, date);
      setTotalMl(total);
    } finally {
      setIsLoading(false);
    }
  }, [childId, date]);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  return { totalMl, isLoading, refetch };
}
