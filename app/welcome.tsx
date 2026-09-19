import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '../src/components/ui/Button';
import { useAppState } from '../src/state/AppStateProvider';
import { colors } from '../src/theme/colors';
import { spacing } from '../src/theme/spacing';
import { typography } from '../src/theme/typography';

export default function WelcomeScreen() {
  const { markWelcomeSeen } = useAppState();

  const handleGetStarted = async () => {
    await markWelcomeSeen();
    router.replace('/onboarding');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.emoji}>🍼</Text>
        <Text style={typography.title}>Milk Tracker</Text>
        <Text style={styles.subtitle}>
          Keep track of every feeding — see today&apos;s total, and browse history by day or
          month.
        </Text>
      </View>
      <Button label="Get Started" onPress={handleGetStarted} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  subtitle: {
    ...typography.body,
    textAlign: 'center',
    color: colors.textMuted,
    marginTop: spacing.md,
  },
});
