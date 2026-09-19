import * as ImagePicker from 'expo-image-picker';
import { File, Paths } from 'expo-file-system';
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

// Native (iOS/Android) implementation: copies the picked photo into the
// app's permanent document storage so it survives cache clears and app
// restarts. Web uses AvatarPicker.web.tsx (a base64 data URI) instead,
// since there's no equivalent persistent file storage there.
export function AvatarPicker({ uri, onChange, size = 96 }: AvatarPickerProps) {
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (result.canceled || !result.assets[0]) return;

    const picked = new File(result.assets[0].uri);
    const destination = new File(Paths.document, `avatar-${Date.now()}.jpg`);
    await picked.copy(destination);
    onChange(destination.uri);
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
