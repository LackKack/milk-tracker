import { Redirect } from 'expo-router';
import React from 'react';

import { useAppState } from '../src/state/AppStateProvider';

export default function Index() {
  const { status } = useAppState();

  if (status === 'loading') return null;
  if (status === 'welcome') return <Redirect href="/welcome" />;
  if (status === 'onboarding') return <Redirect href="/onboarding" />;
  return <Redirect href="/(tabs)/dashboard" />;
}
