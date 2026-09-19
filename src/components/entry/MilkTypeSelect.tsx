import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { MILK_TYPES, MILK_TYPE_LABELS, MilkType } from '../../models/MilkType';
import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

interface MilkTypeSelectProps {
  value: MilkType;
  onChange: (value: MilkType) => void;
}

export function MilkTypeSelect({ value, onChange }: MilkTypeSelectProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Type of milk</Text>
      <View style={styles.row}>
        {MILK_TYPES.map((type) => {
          const selected = type === value;
          return (
            <Pressable
              key={type}
              onPress={() => onChange(type)}
              style={[styles.chip, selected && styles.chipSelected]}
            >
              <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                {MILK_TYPE_LABELS[type]}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.caption,
    marginBottom: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    ...typography.body,
    fontSize: 14,
  },
  chipTextSelected: {
    color: '#FFFFFF',
  },
});
