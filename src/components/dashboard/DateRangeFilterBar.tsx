import React from 'react';
import { StyleSheet, View } from 'react-native';

import { DateField } from '../ui/DateField';
import { spacing } from '../../theme/spacing';

interface DateRangeFilterBarProps {
  from: string;
  to: string;
  onChangeFrom: (value: string) => void;
  onChangeTo: (value: string) => void;
}

export function DateRangeFilterBar({ from, to, onChangeFrom, onChangeTo }: DateRangeFilterBarProps) {
  return (
    <View style={styles.row}>
      <View style={styles.field}>
        <DateField label="From" value={from} onChange={onChangeFrom} />
      </View>
      <View style={styles.field}>
        <DateField label="To" value={to} onChange={onChangeTo} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  field: {
    flex: 1,
  },
});
