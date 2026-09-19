import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DailyTotalCard } from '../../src/components/dashboard/DailyTotalCard';
import { DateRangeFilterBar } from '../../src/components/dashboard/DateRangeFilterBar';
import { EntryListItem } from '../../src/components/dashboard/EntryListItem';
import { MonthCalendar } from '../../src/components/dashboard/MonthCalendar';
import { Card } from '../../src/components/ui/Card';
import { addDays, currentYearMonth, formatDateForDisplay, today } from '../../src/lib/date';
import type { MilkEntry } from '../../src/models/MilkEntry';
import { useAppState } from '../../src/state/AppStateProvider';
import { useDailyTotal } from '../../src/state/useDailyTotal';
import { useDateRangeEntries } from '../../src/state/useDateRangeEntries';
import { useMonthSummary } from '../../src/state/useMonthSummary';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';
import { typography } from '../../src/theme/typography';

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

  const [yearMonth, setYearMonth] = useState(currentYearMonth());
  const [selectedDate, setSelectedDate] = useState(today());
  const { days } = useMonthSummary(childId, yearMonth);
  const { entries: dayEntries } = useDateRangeEntries(childId, selectedDate, selectedDate);

  const [rangeFrom, setRangeFrom] = useState(addDays(today(), -6));
  const [rangeTo, setRangeTo] = useState(today());
  const { entries: rangeEntries } = useDateRangeEntries(childId, rangeFrom, rangeTo);
  const groupedRange = useMemo(() => groupByDate(rangeEntries), [rangeEntries]);

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
          <Text style={typography.heading}>Month view</Text>
          <Card style={styles.calendarCard}>
            <MonthCalendar
              yearMonth={yearMonth}
              days={days}
              selectedDate={selectedDate}
              onChangeMonth={setYearMonth}
              onSelectDay={setSelectedDate}
            />
          </Card>

          <Card style={styles.dayDetailCard}>
            <Text style={styles.dayDetailTitle}>{formatDateForDisplay(selectedDate)}</Text>
            {dayEntries.length === 0 ? (
              <Text style={styles.emptyText}>No entries logged.</Text>
            ) : (
              dayEntries.map((entry) => (
                <EntryListItem key={entry.id} entry={entry} onPress={openEntry} />
              ))
            )}
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={typography.heading}>History by date range</Text>
          <Card>
            <DateRangeFilterBar
              from={rangeFrom}
              to={rangeTo}
              onChangeFrom={setRangeFrom}
              onChangeTo={setRangeTo}
            />
            {groupedRange.length === 0 ? (
              <Text style={styles.emptyText}>No entries in this range.</Text>
            ) : (
              groupedRange.map((group) => (
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
  calendarCard: {
    marginTop: spacing.sm,
  },
  dayDetailCard: {
    marginTop: spacing.sm,
  },
  dayDetailTitle: {
    ...typography.body,
    fontWeight: '600',
    marginBottom: spacing.xs,
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
    ...typography.body,
    fontWeight: '600',
  },
  rangeGroupTotal: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
});
