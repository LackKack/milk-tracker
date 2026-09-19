import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

interface TimeFieldProps {
  label: string;
  value: string; // 'HH:mm'
  onChange: (value: string) => void;
}

// react-native's tsconfig doesn't include DOM lib types, so a plain <input>
// JSX tag won't type-check even on .web.tsx files; alias it to bypass that.
const WebInput = 'input' as unknown as React.ComponentType<{
  type: string;
  value: string;
  onChange: (e: { target: { value: string } }) => void;
  style?: React.CSSProperties;
}>;

// Web implementation using the native browser time picker, since
// @react-native-community/datetimepicker doesn't support web.
export function TimeField({ label, value, onChange }: TimeFieldProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <WebInput
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={webInputStyle}
      />
    </View>
  );
}

const webInputStyle: React.CSSProperties = {
  fontSize: 16,
  padding: spacing.sm,
  borderRadius: radius.sm,
  border: `1px solid ${colors.border}`,
  backgroundColor: colors.surface,
  color: colors.text,
  fontFamily: 'inherit',
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.caption,
    marginBottom: spacing.xs,
  },
});
