import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MilkTypeSelect } from '../../src/components/entry/MilkTypeSelect';
import { Button } from '../../src/components/ui/Button';
import { DateField } from '../../src/components/ui/DateField';
import { FormField } from '../../src/components/ui/FormField';
import { TimeField } from '../../src/components/ui/TimeField';
import { nowTime, today } from '../../src/lib/date';
import type { MilkType } from '../../src/models/MilkType';
import { useAppState } from '../../src/state/AppStateProvider';
import { useMilkEntries } from '../../src/state/useMilkEntries';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';
import { typography } from '../../src/theme/typography';

export default function LogEntryScreen() {
  const { activeChild } = useAppState();
  const { createEntry } = useMilkEntries();

  const [amountMl, setAmountMl] = useState('');
  const [milkType, setMilkType] = useState<MilkType>('breast_milk');
  const [entryDate, setEntryDate] = useState(today());
  const [entryTime, setEntryTime] = useState(nowTime());
  const [notes, setNotes] = useState('');
  const [amountError, setAmountError] = useState<string | undefined>();
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const amount = Number(amountMl);
    if (!amountMl || Number.isNaN(amount) || amount <= 0) {
      setAmountError('Enter an amount greater than 0');
      return;
    }
    if (!activeChild) return;

    setAmountError(undefined);
    setSaving(true);
    try {
      await createEntry({
        childId: activeChild.id,
        amountMl: Math.round(amount),
        milkType,
        entryDate,
        entryTime,
        notes: notes.trim() || null,
      });
      setAmountMl('');
      setNotes('');
      setEntryDate(today());
      setEntryTime(nowTime());
      router.replace('/(tabs)/dashboard');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={typography.title}>Log a feeding</Text>

        <FormField
          label="Amount (ml)"
          value={amountMl}
          onChangeText={setAmountMl}
          placeholder="e.g. 120"
          keyboardType="number-pad"
          error={amountError}
        />

        <MilkTypeSelect value={milkType} onChange={setMilkType} />

        <DateField label="Date" value={entryDate} onChange={setEntryDate} />
        <TimeField label="Time" value={entryTime} onChange={setEntryTime} />

        <FormField
          label="Notes"
          value={notes}
          onChangeText={setNotes}
          placeholder="Optional"
        />

        <Button label="Save entry" onPress={handleSave} loading={saving} />
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
});
