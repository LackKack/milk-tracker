import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { formatTime, formatTimeForDisplay } from '../../lib/date';
import { Button } from './Button';
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
//
// Android's native time dialog already animates in/out and closes itself
// once confirmed. iOS's spinner fires continuously while scrolling, so
// rather than closing on the first tick (which would slam shut mid-scroll),
// it opens in an animated bottom sheet with an explicit Done button.
//
// themeVariant is forced to 'light' so the spinner always renders with our
// app's light pastel sheet instead of switching to a transparent-looking
// dark rendering when the phone is in system Dark Mode.
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

      {Platform.OS === 'android' && showPicker && (
        <DateTimePicker
          value={timeToDate(value)}
          mode="time"
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
                value={timeToDate(value)}
                mode="time"
                display="spinner"
                onChange={handleChange}
                themeVariant="light"
              />
              <Button label="Done" onPress={() => setShowPicker(false)} />
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
    gap: spacing.sm,
  },
});
