import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

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
//
// Android's native date dialog already animates in/out and closes itself as
// soon as a date is confirmed, so it's rendered as-is. iOS's picker is just
// an embedded view (no dialog of its own), so it's wrapped in an animated
// bottom sheet here, and that sheet closes itself the moment a day is
// tapped (the inline calendar fires one 'set' event per tap).
//
// themeVariant is forced to 'light' so the picker always renders with our
// app's light pastel sheet instead of switching to a transparent-looking
// dark rendering when the phone is in system Dark Mode.
export function DateField({ label, value, onChange }: DateFieldProps) {
  const [showPicker, setShowPicker] = useState(false);

  const handleChange = (event: DateTimePickerEvent, selected?: Date) => {
    setShowPicker(false);
    if (event.type === 'dismissed' || !selected) return;
    onChange(formatDate(selected));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Pressable style={styles.input} onPress={() => setShowPicker(true)}>
        <Text style={typography.body}>{formatDateForDisplay(value)}</Text>
      </Pressable>

      {Platform.OS === 'android' && showPicker && (
        <DateTimePicker
          value={parseDate(value)}
          mode="date"
          display="default"
          onChange={handleChange}
        />
      )}

      {Platform.OS !== 'android' && (
        <Modal
          visible={showPicker}
          transparent
          animationType="slide"
          onRequestClose={() => setShowPicker(false)}
        >
          <View style={styles.overlay}>
            <Pressable style={styles.backdrop} onPress={() => setShowPicker(false)} />
            <View style={styles.sheet}>
              <DateTimePicker
                value={parseDate(value)}
                mode="date"
                display="inline"
                onChange={handleChange}
                themeVariant="light"
                accentColor={colors.primary}
              />
            </View>
          </View>
        </Modal>
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
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: spacing.md,
    paddingBottom: spacing.lg,
    alignItems: 'center',
  },
});
