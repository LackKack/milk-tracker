import { router } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '../../src/components/ui/Button';
import { Card } from '../../src/components/ui/Card';
import { formatDateForDisplay } from '../../src/lib/date';
import { GENDER_LABELS } from '../../src/models/Child';
import { useAppState } from '../../src/state/AppStateProvider';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';
import { typography } from '../../src/theme/typography';

export default function ProfileScreen() {
  const { activeChild } = useAppState();

  if (!activeChild) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={typography.title}>Profile</Text>

        <Card style={styles.card}>
          <View style={styles.header}>
            {activeChild.avatarUri ? (
              <Image source={{ uri: activeChild.avatarUri }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Text style={styles.avatarInitial}>{activeChild.name.charAt(0).toUpperCase()}</Text>
              </View>
            )}
            <View>
              <Text style={styles.name}>{activeChild.name}</Text>
              <Text style={typography.caption}>{GENDER_LABELS[activeChild.gender]}</Text>
            </View>
          </View>

          <Row label="Date of birth" value={formatDateForDisplay(activeChild.dateOfBirth)} />
          <Row
            label="Weight"
            value={activeChild.weightKg != null ? `${activeChild.weightKg} kg` : '—'}
          />
          <Row
            label="Height"
            value={activeChild.heightCm != null ? `${activeChild.heightCm} cm` : '—'}
          />
        </Card>

        <Button label="Edit profile" onPress={() => router.push('/onboarding')} />
      </View>
    </SafeAreaView>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={typography.caption}>{label}</Text>
      <Text style={typography.body}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  card: {
    gap: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  avatarPlaceholder: {
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    ...typography.heading,
  },
  name: {
    ...typography.heading,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
