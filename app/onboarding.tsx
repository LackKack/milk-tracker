import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AvatarPicker } from '../src/components/ui/AvatarPicker';
import { Button } from '../src/components/ui/Button';
import { DateField } from '../src/components/ui/DateField';
import { FormField } from '../src/components/ui/FormField';
import { today } from '../src/lib/date';
import { parseOptionalDecimal } from '../src/lib/number';
import { GENDERS, GENDER_LABELS, Gender } from '../src/models/Child';
import { useChildProfile } from '../src/state/useChildProfile';
import { colors } from '../src/theme/colors';
import { radius, spacing } from '../src/theme/spacing';
import { typography } from '../src/theme/typography';

export default function OnboardingScreen() {
  const { activeChild, saveProfile } = useChildProfile();
  const isEditing = !!activeChild;

  const [name, setName] = useState(activeChild?.name ?? '');
  const [dateOfBirth, setDateOfBirth] = useState(activeChild?.dateOfBirth ?? today());
  const [gender, setGender] = useState<Gender>(activeChild?.gender ?? 'prefer_not_to_say');
  const [avatarUri, setAvatarUri] = useState<string | null>(activeChild?.avatarUri ?? null);
  const [weight, setWeight] = useState(activeChild?.weightKg?.toString() ?? '');
  const [height, setHeight] = useState(activeChild?.heightCm?.toString() ?? '');
  const [nameError, setNameError] = useState<string | undefined>();
  const [saveError, setSaveError] = useState<string | undefined>();
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      setNameError('Please enter a name');
      return;
    }
    setNameError(undefined);
    setSaveError(undefined);
    setSaving(true);
    try {
      await saveProfile({
        name: name.trim(),
        dateOfBirth,
        gender,
        avatarUri,
        weightKg: parseOptionalDecimal(weight),
        heightCm: parseOptionalDecimal(height),
      });
      if (isEditing) {
        router.back();
      } else {
        router.replace('/(tabs)/dashboard');
      }
    } catch (error) {
      console.error('Failed to save profile', error);
      setSaveError("Couldn't save the profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={typography.title}>{isEditing ? 'Edit Profile' : "Tell us about your kid"}</Text>
        <Text style={styles.subtitle}>
          This helps personalize the app. You can update it anytime from Profile.
        </Text>

        <AvatarPicker uri={avatarUri} onChange={setAvatarUri} />

        <FormField
          label="Name"
          value={name}
          onChangeText={setName}
          placeholder="e.g. Alex"
          error={nameError}
        />

        <DateField label="Date of birth" value={dateOfBirth} onChange={setDateOfBirth} />

        <View style={styles.genderContainer}>
          <Text style={styles.genderLabel}>Gender</Text>
          <View style={styles.genderRow}>
            {GENDERS.map((g) => {
              const selected = g === gender;
              return (
                <Pressable
                  key={g}
                  onPress={() => setGender(g)}
                  style={[styles.chip, selected && styles.chipSelected]}
                >
                  <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                    {GENDER_LABELS[g]}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <FormField
          label="Weight (kg)"
          value={weight}
          onChangeText={setWeight}
          placeholder="Optional"
          keyboardType="decimal-pad"
        />

        <FormField
          label="Height (cm)"
          value={height}
          onChangeText={setHeight}
          placeholder="Optional"
          keyboardType="decimal-pad"
        />

        {saveError ? <Text style={styles.saveError}>{saveError}</Text> : null}
        <Button label="Save" onPress={handleSave} loading={saving} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  genderContainer: {
    marginBottom: spacing.md,
  },
  genderLabel: {
    ...typography.caption,
    marginBottom: spacing.xs,
  },
  genderRow: {
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
  saveError: {
    ...typography.caption,
    color: colors.danger,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
});
