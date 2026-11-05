import { StyleSheet, Text, View } from 'react-native';

import { HeartIcon, StreakIcon, XpIcon } from '@/components/GameIcons';
import { currentStreak, dayKey } from '@/progress/progress';
import { useProgress } from '@/progress/ProgressContext';
import { colors, spacing } from '@/theme';

export function StatsBar({ large = false }: { large?: boolean }) {
  const iconSize = large ? 44 : 24;
  const valueStyle = [styles.value, large && styles.valueLarge];

  const { progress } = useProgress();
  const streak = currentStreak(progress, dayKey(new Date()));

  return (
    <View
      accessible
      accessibilityLabel={`${progress.hearts} hearts, ${progress.xp} XP, ${streak} day streak`}
      style={[styles.bar, large && styles.barLarge]}
    >
      <View style={styles.stat}>
        <HeartIcon size={iconSize} />
        <Text style={valueStyle}>{progress.hearts}</Text>
      </View>
      <View style={styles.stat}>
        <XpIcon size={iconSize} />
        <Text style={valueStyle}>{progress.xp} XP</Text>
      </View>
      <View style={styles.stat}>
        <StreakIcon size={iconSize} />
        <Text style={valueStyle}>{streak}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  barLarge: {
    gap: spacing.lg,
    justifyContent: 'center',
  },
  stat: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
  },
  valueLarge: {
    fontSize: 28,
    fontWeight: '800',
  },
  value: {
    color: colors.brown,
    fontSize: 16,
    fontWeight: '700',
  },
});
