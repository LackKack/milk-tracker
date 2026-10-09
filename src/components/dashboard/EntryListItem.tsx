import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { formatTimeForDisplay } from '../../lib/date';
import type { MilkEntry } from '../../models/MilkEntry';
import { MILK_TYPE_LABELS } from '../../models/MilkType';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

interface EntryListItemProps {
  entry: MilkEntry;
  onPress?: (entry: MilkEntry) => void;
}

export function EntryListItem({ entry, onPress }: EntryListItemProps) {
  return (
    <Pressable style={styles.row} onPress={() => onPress?.(entry)}>
      <View>
        <Text style={typography.body}>{MILK_TYPE_LABELS[entry.milkType]}</Text>
        <Text style={typography.caption}>{formatTimeForDisplay(entry.entryTime)}</Text>
      </View>
      <Text style={styles.amount}>{entry.amountMl} ml</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  amount: {
    ...typography.bodyStrong,
    color: colors.primary,
  },
});
