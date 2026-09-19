import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

import { childRepository } from '../data/repositories';
import { APP_SETTINGS_KEYS } from '../lib/constants';
import { getSetting, setSetting } from '../lib/settingsStore';
import type { Child } from '../models/Child';

export type BootStatus = 'loading' | 'welcome' | 'onboarding' | 'ready';

interface AppStateValue {
  status: BootStatus;
  activeChild: Child | null;
  markWelcomeSeen: () => Promise<void>;
  refreshActiveChild: () => Promise<void>;
  setActiveChild: (child: Child) => void;
}

const AppStateContext = createContext<AppStateValue | undefined>(undefined);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<BootStatus>('loading');
  const [activeChild, setActiveChildState] = useState<Child | null>(null);

  const bootstrap = useCallback(async () => {
    const [hasSeenWelcome, child] = await Promise.all([
      getSetting(APP_SETTINGS_KEYS.hasSeenWelcome),
      childRepository.getActiveChild(),
    ]);

    setActiveChildState(child);

    if (child) {
      setStatus('ready');
    } else if (hasSeenWelcome === 'true') {
      setStatus('onboarding');
    } else {
      setStatus('welcome');
    }
  }, []);

  useEffect(() => {
    bootstrap().catch((error) => {
      console.error('Failed to initialize app state', error);
    });
  }, [bootstrap]);

  const markWelcomeSeen = useCallback(async () => {
    await setSetting(APP_SETTINGS_KEYS.hasSeenWelcome, 'true');
    setStatus('onboarding');
  }, []);

  const refreshActiveChild = useCallback(async () => {
    const child = await childRepository.getActiveChild();
    setActiveChildState(child);
    if (child) {
      await setSetting(APP_SETTINGS_KEYS.hasCompletedOnboarding, 'true');
      setStatus('ready');
    }
  }, []);

  const setActiveChild = useCallback((child: Child) => {
    setActiveChildState(child);
    setSetting(APP_SETTINGS_KEYS.hasCompletedOnboarding, 'true').catch((error) => {
      console.error('Failed to persist onboarding flag', error);
    });
    setStatus('ready');
  }, []);

  return (
    <AppStateContext.Provider
      value={{ status, activeChild, markWelcomeSeen, refreshActiveChild, setActiveChild }}
    >
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState(): AppStateValue {
  const ctx = useContext(AppStateContext);
  if (!ctx) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return ctx;
}
