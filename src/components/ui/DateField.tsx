import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { formatDate, formatDateForDisplay, parseDate } from '../../lib/date';
import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

interface DateFieldProps {
  label: string;
  value: string; // 'YYYY-MM-DD'
  onChange: (value: string) => void;
}

// Native (iOS/Android) implementation. Web uses DateField.web.tsx instead,
// since @react-native-community/datetimepicker has no web support.
export function DateField({ label, value, onChange }: DateFieldProps) {
  const [showPicker, setShowPicker] = useState(false);

  const handleChange = (event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    if (event.type === 'dismissed' || !selected) return;
    onChange(formatDate(selected));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Pressable style={styles.input} onPress={() => setShowPicker(true)}>
        <Text style={typography.body}>{formatDateForDisplay(value)}</Text>
      </Pressable>
      {showPicker && (
        <DateTimePicker
          value={parseDate(value)}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={handleChange}
        />
      )}
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
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
  },
});
