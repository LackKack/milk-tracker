import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { formatDateForDisplay, formatDateShort } from '../../lib/date';
import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

interface ChartPoint {
  date: string;
  totalMl: number;
}

interface MilkBarChartProps {
  data: ChartPoint[]; // chronological ascending, one point per day (zero-filled)
}

const CHART_HEIGHT = 120;
const BAR_WIDTH = 24;

// A single-series magnitude chart doesn't need a categorical palette or a
// legend (the heading names the one series) — just the brand color, a
// baseline, and a tap target per bar instead of printing a value on every
// bar (there's no hover on touch devices, and labeling every point gets
// noisy once the range spans a month).
export function MilkBarChart({ data }: MilkBarChartProps) {
  const [selected, setSelected] = useState<ChartPoint | null>(null);

  if (data.length === 0) {
    return <Text style={typography.caption}>No data to chart yet.</Text>;
  }

  const maxTotal = Math.max(...data.map((d) => d.totalMl), 1);

  return (
    <View>
      <Text style={styles.caption}>
        {selected
          ? `${formatDateForDisplay(selected.date)}: ${selected.totalMl} ml`
          : 'Tap a bar to see its total'}
      </Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.row}>
          {data.map((point) => {
            const barHeight = Math.round((point.totalMl / maxTotal) * CHART_HEIGHT);
            const isSelected = selected?.date === point.date;
            return (
              <Pressable
                key={point.date}
                style={styles.column}
                onPress={() => setSelected(isSelected ? null : point)}
              >
                <View style={styles.track}>
                  {barHeight > 0 && (
                    <View
                      style={[
                        styles.bar,
                        { height: barHeight },
                        isSelected && styles.barSelected,
                      ]}
                    />
                  )}
                </View>
                <Text style={styles.dateLabel}>{formatDateShort(point.date)}</Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  caption: {
    ...typography.caption,
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  column: {
    width: BAR_WIDTH,
    alignItems: 'center',
  },
  track: {
    height: CHART_HEIGHT,
    width: BAR_WIDTH,
    justifyContent: 'flex-end',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  bar: {
    width: BAR_WIDTH,
    backgroundColor: colors.primary,
    borderTopLeftRadius: radius.sm,
    borderTopRightRadius: radius.sm,
  },
  barSelected: {
    backgroundColor: colors.primaryDark,
  },
  dateLabel: {
    ...typography.caption,
    fontSize: 11,
    marginTop: spacing.xs,
  },
});
