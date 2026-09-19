import * as ImagePicker from 'expo-image-picker';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

interface AvatarPickerProps {
  uri: string | null;
  onChange: (uri: string) => void;
  size?: number;
}

// Web implementation: stores the picture as a base64 data URI directly (via
// expo-image-picker's base64 option), since object/blob URLs don't survive
// a page reload and there's no persistent file system to copy into on web.
export function AvatarPicker({ uri, onChange, size = 96 }: AvatarPickerProps) {
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
      base64: true,
    });
    if (result.canceled || !result.assets[0]?.base64) return;

    const mimeType = result.assets[0].mimeType ?? 'image/jpeg';
    onChange(`data:${mimeType};base64,${result.assets[0].base64}`);
  };

  return (
    <Pressable onPress={pickImage} style={styles.wrapper}>
      <View style={[styles.circle, { width: size, height: size, borderRadius: size / 2 }]}>
        {uri ? (
          <Image source={{ uri }} style={{ width: size, height: size, borderRadius: size / 2 }} />
        ) : (
          <Text style={styles.placeholder}>+</Text>
        )}
      </View>
      <Text style={styles.label}>{uri ? 'Change photo' : 'Add photo'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  circle: {
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  placeholder: {
    fontSize: 32,
    color: colors.textMuted,
  },
  label: {
    ...typography.caption,
    color: colors.primary,
    marginTop: spacing.xs,
  },
});
