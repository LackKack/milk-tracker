import { useCallback } from 'react';

import { childRepository } from '../data/repositories';
import type { NewChildInput } from '../models/Child';
import { useAppState } from './AppStateProvider';

/** Create or update the single active child profile, keeping app state in sync. */
export function useChildProfile() {
  const { activeChild, setActiveChild } = useAppState();

  const saveProfile = useCallback(
    async (input: NewChildInput) => {
      const child = activeChild
        ? await childRepository.updateChild(activeChild.id, input)
        : await childRepository.createChild(input);
      setActiveChild(child);
      return child;
    },
    [activeChild, setActiveChild]
  );

  return { activeChild, saveProfile };
}
