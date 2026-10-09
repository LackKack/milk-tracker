import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DailyTotalCard } from '../../src/components/dashboard/DailyTotalCard';
import { DateRangeFilterBar } from '../../src/components/dashboard/DateRangeFilterBar';
import { EntryListItem } from '../../src/components/dashboard/EntryListItem';
import { MilkBarChart } from '../../src/components/dashboard/MilkBarChart';
import { Card } from '../../src/components/ui/Card';
import { Select, SelectOption } from '../../src/components/ui/Select';
import {
  addDays,
  addMonthsToDate,
  datesBetween,
  formatDateForDisplay,
  today,
} from '../../src/lib/date';
import type { MilkEntry } from '../../src/models/MilkEntry';
import { useAppState } from '../../src/state/AppStateProvider';
import { useDailyTotal } from '../../src/state/useDailyTotal';
import { useDateRangeEntries } from '../../src/state/useDateRangeEntries';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';
import { typography } from '../../src/theme/typography';

type RangePreset = 'yesterday' | 'twoDaysAgo' | 'week' | 'month' | 'custom';

const RANGE_PRESET_OPTIONS: SelectOption<RangePreset>[] = [
  { value: 'yesterday', label: '1 day ago' },
  { value: 'twoDaysAgo', label: '2 days ago' },
  { value: 'week', label: 'A week from current date' },
  { value: 'month', label: '1 month ago' },
  { value: 'custom', label: 'Custom range' },
];

function presetRange(
  preset: RangePreset,
  customFrom: string,
  customTo: string
): { from: string; to: string } {
  const t = today();
  switch (preset) {
    case 'yesterday': {
      const d = addDays(t, -1);
      return { from: d, to: d };
    }
    case 'twoDaysAgo': {
      const d = addDays(t, -2);
      return { from: d, to: d };
    }
    case 'week':
      return { from: addDays(t, -6), to: t };
    case 'month':
      return { from: addMonthsToDate(t, -1), to: t };
    case 'custom':
      return { from: customFrom, to: customTo };
  }
}

function groupByDate(entries: MilkEntry[]): { date: string; total: number; entries: MilkEntry[] }[] {
  const map = new Map<string, MilkEntry[]>();
  for (const entry of entries) {
    const list = map.get(entry.entryDate) ?? [];
    list.push(entry);
    map.set(entry.entryDate, list);
  }
  return Array.from(map.entries())
    .map(([date, list]) => ({
      date,
      total: list.reduce((sum, e) => sum + e.amountMl, 0),
      entries: list,
    }))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

function openEntry(entry: MilkEntry) {
  router.push({
    pathname: '/entry/[id]',
    params: {
      id: entry.id,
      amountMl: String(entry.amountMl),
      milkType: entry.milkType,
      entryDate: entry.entryDate,
      entryTime: entry.entryTime,
      notes: entry.notes ?? '',
    },
  });
}

export default function DashboardScreen() {
  const { activeChild } = useAppState();
  const childId = activeChild?.id;

  const { totalMl } = useDailyTotal(childId, today());

  const [preset, setPreset] = useState<RangePreset>('week');
  const [customFrom, setCustomFrom] = useState(addDays(today(), -6));
  const [customTo, setCustomTo] = useState(today());

  const { from, to } = useMemo(
    () => presetRange(preset, customFrom, customTo),
    [preset, customFrom, customTo]
  );
  const { entries } = useDateRangeEntries(childId, from, to);
  const grouped = useMemo(() => groupByDate(entries), [entries]);

  const chartData = useMemo(() => {
    const totalsByDate = new Map(grouped.map((g) => [g.date, g.total]));
    return datesBetween(from, to).map((date) => ({
      date,
      totalMl: totalsByDate.get(date) ?? 0,
    }));
  }, [grouped, from, to]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={typography.title}>
          {activeChild ? `${activeChild.name}'s Dashboard` : 'Dashboard'}
        </Text>

        <View style={styles.section}>
          <DailyTotalCard totalMl={totalMl} />
        </View>

        <View style={styles.section}>
          <Text style={typography.heading}>History</Text>
          <Card>
            <Select value={preset} options={RANGE_PRESET_OPTIONS} onChange={setPreset} />

            {preset === 'custom' && (
              <DateRangeFilterBar
                from={customFrom}
                to={customTo}
                onChangeFrom={setCustomFrom}
                onChangeTo={setCustomTo}
              />
            )}

            <Text style={styles.rangeCaption}>
              {from === to
                ? formatDateForDisplay(from)
                : `${formatDateForDisplay(from)} – ${formatDateForDisplay(to)}`}
            </Text>

            {grouped.length === 0 ? (
              <Text style={styles.emptyText}>No entries in this range.</Text>
            ) : (
              grouped.map((group) => (
                <View key={group.date} style={styles.rangeGroup}>
                  <View style={styles.rangeGroupHeader}>
                    <Text style={styles.rangeGroupDate}>{formatDateForDisplay(group.date)}</Text>
                    <Text style={styles.rangeGroupTotal}>{group.total} ml</Text>
                  </View>
                  {group.entries.map((entry) => (
                    <EntryListItem key={entry.id} entry={entry} onPress={openEntry} />
                  ))}
                </View>
              ))
            )}
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={typography.heading}>Totals by day</Text>
          <Card>
            <MilkBarChart data={chartData} />
          </Card>
        </View>
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
    paddingBottom: spacing.xl,
  },
  section: {
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  rangeCaption: {
    ...typography.caption,
    marginBottom: spacing.sm,
  },
  emptyText: {
    ...typography.caption,
  },
  rangeGroup: {
    marginTop: spacing.sm,
  },
  rangeGroupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  rangeGroupDate: {
    ...typography.bodyStrong,
  },
  rangeGroupTotal: {
    ...typography.bodyStrong,
    color: colors.primary,
  },
});
