import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MilkTypeSelect } from '../../src/components/entry/MilkTypeSelect';
import { Button } from '../../src/components/ui/Button';
import { DateField } from '../../src/components/ui/DateField';
import { FormField } from '../../src/components/ui/FormField';
import { TimeField } from '../../src/components/ui/TimeField';
import type { MilkType } from '../../src/models/MilkType';
import { useMilkEntries } from '../../src/state/useMilkEntries';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';

export default function EntryDetailScreen() {
  const params = useLocalSearchParams<{
    id: string;
    amountMl: string;
    milkType: MilkType;
    entryDate: string;
    entryTime: string;
    notes: string;
  }>();
  const { updateEntry, deleteEntry } = useMilkEntries();

  const [amountMl, setAmountMl] = useState(params.amountMl ?? '');
  const [milkType, setMilkType] = useState<MilkType>(params.milkType ?? 'breast_milk');
  const [entryDate, setEntryDate] = useState(params.entryDate ?? '');
  const [entryTime, setEntryTime] = useState(params.entryTime ?? '');
  const [notes, setNotes] = useState(params.notes ?? '');
  const [amountError, setAmountError] = useState<string | undefined>();
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const amount = Number(amountMl);
    if (!amountMl || Number.isNaN(amount) || amount <= 0) {
      setAmountError('Enter an amount greater than 0');
      return;
    }
    setAmountError(undefined);
    setSaving(true);
    try {
      await updateEntry(params.id, {
        amountMl: Math.round(amount),
        milkType,
        entryDate,
        entryTime,
        notes: notes.trim() || null,
      });
      router.back();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert('Delete entry', 'Are you sure you want to delete this entry?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteEntry(params.id);
          router.back();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <FormField
          label="Amount (ml)"
          value={amountMl}
          onChangeText={setAmountMl}
          keyboardType="number-pad"
          error={amountError}
        />
        <MilkTypeSelect value={milkType} onChange={setMilkType} />
        <DateField label="Date" value={entryDate} onChange={setEntryDate} />
        <TimeField label="Time" value={entryTime} onChange={setEntryTime} />
        <FormField label="Notes" value={notes} onChangeText={setNotes} placeholder="Optional" />

        <Button label="Save changes" onPress={handleSave} loading={saving} />
        <Button label="Delete entry" onPress={handleDelete} variant="secondary" />
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
    gap: spacing.md,
  },
});
