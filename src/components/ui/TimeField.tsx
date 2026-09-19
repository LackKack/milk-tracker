import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { formatTime, formatTimeForDisplay } from '../../lib/date';
import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

interface TimeFieldProps {
  label: string;
  value: string; // 'HH:mm'
  onChange: (value: string) => void;
}

function timeToDate(value: string): Date {
  const [hours, minutes] = value.split(':').map(Number);
  const d = new Date();
  d.setHours(hours, minutes, 0, 0);
  return d;
}

// Native (iOS/Android) implementation. Web uses TimeField.web.tsx instead,
// since @react-native-community/datetimepicker has no web support.
export function TimeField({ label, value, onChange }: TimeFieldProps) {
  const [showPicker, setShowPicker] = useState(false);

  const handleChange = (event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    if (event.type === 'dismissed' || !selected) return;
    onChange(formatTime(selected));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Pressable style={styles.input} onPress={() => setShowPicker(true)}>
        <Text style={typography.body}>{formatTimeForDisplay(value)}</Text>
      </Pressable>
      {showPicker && (
        <DateTimePicker
          value={timeToDate(value)}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
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
