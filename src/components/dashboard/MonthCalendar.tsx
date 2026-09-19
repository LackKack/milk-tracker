import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { addMonths, buildMonthGrid, monthLabel } from '../../lib/date';
import type { MonthSummaryDay } from '../../models/MilkEntry';
import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

interface MonthCalendarProps {
  yearMonth: string;
  days: MonthSummaryDay[];
  selectedDate: string | null;
  onChangeMonth: (yearMonth: string) => void;
  onSelectDay: (date: string) => void;
}

const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export function MonthCalendar({
  yearMonth,
  days,
  selectedDate,
  onChangeMonth,
  onSelectDay,
}: MonthCalendarProps) {
  const totalsByDate = new Map(days.map((d) => [d.date, d.totalMl]));
  const grid = buildMonthGrid(yearMonth);

  return (
    <View>
      <View style={styles.header}>
        <Pressable onPress={() => onChangeMonth(addMonths(yearMonth, -1))} hitSlop={8}>
          <Text style={styles.navArrow}>{'‹'}</Text>
        </Pressable>
        <Text style={styles.monthLabel}>{monthLabel(yearMonth)}</Text>
        <Pressable onPress={() => onChangeMonth(addMonths(yearMonth, 1))} hitSlop={8}>
          <Text style={styles.navArrow}>{'›'}</Text>
        </Pressable>
      </View>

      <View style={styles.weekdayRow}>
        {WEEKDAY_LABELS.map((label, i) => (
          <Text key={i} style={styles.weekdayLabel}>
            {label}
          </Text>
        ))}
      </View>

      <View style={styles.grid}>
        {grid.map((cell, i) => {
          if (!cell.date) {
            return <View key={i} style={styles.cell} />;
          }
          const total = totalsByDate.get(cell.date) ?? 0;
          const isSelected = cell.date === selectedDate;
          const dayNumber = Number(cell.date.slice(-2));
          return (
            <Pressable
              key={i}
              style={[styles.cell, styles.dayCell, isSelected && styles.dayCellSelected]}
              onPress={() => onSelectDay(cell.date as string)}
            >
              <Text style={[styles.dayNumber, isSelected && styles.dayTextSelected]}>
                {dayNumber}
              </Text>
              {total > 0 && (
                <Text style={[styles.dayTotal, isSelected && styles.dayTextSelected]}>
                  {total}
                </Text>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  navArrow: {
    fontSize: 24,
    color: colors.primary,
    paddingHorizontal: spacing.sm,
  },
  monthLabel: {
    ...typography.heading,
  },
  weekdayRow: {
    flexDirection: 'row',
  },
  weekdayLabel: {
    flex: 1,
    textAlign: 'center',
    ...typography.caption,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCell: {
    borderRadius: radius.sm,
  },
  dayCellSelected: {
    backgroundColor: colors.primary,
  },
  dayNumber: {
    ...typography.body,
    fontSize: 14,
  },
  dayTotal: {
    ...typography.caption,
    fontSize: 10,
    color: colors.primary,
  },
  dayTextSelected: {
    color: '#FFFFFF',
  },
});
