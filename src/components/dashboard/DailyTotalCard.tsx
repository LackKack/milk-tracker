import React from 'react';
import { StyleSheet, Text } from 'react-native';

import { Card } from '../ui/Card';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

interface DailyTotalCardProps {
  totalMl: number;
  label?: string;
}

export function DailyTotalCard({ totalMl, label = "Today's total" }: DailyTotalCardProps) {
  return (
    <Card style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.total}>{totalMl} ml</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  label: {
    ...typography.caption,
    marginBottom: spacing.xs,
  },
  total: {
    ...typography.title,
    fontSize: 40,
    color: colors.primary,
  },
});
