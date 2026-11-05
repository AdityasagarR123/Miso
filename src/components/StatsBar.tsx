import { StyleSheet, Text, View } from 'react-native';

import { HeartIcon, StreakIcon, XpIcon } from '@/components/GameIcons';
import { currentStreak, dayKey } from '@/progress/progress';
import { useProgress } from '@/progress/ProgressContext';
import { colors, spacing } from '@/theme';

export function StatsBar() {
  const { progress } = useProgress();
  const streak = currentStreak(progress, dayKey(new Date()));

  return (
    <View
      accessible
      accessibilityLabel={`${progress.hearts} hearts, ${progress.xp} XP, ${streak} day streak`}
      style={styles.bar}
    >
      <View style={styles.stat}>
        <HeartIcon size={24} />
        <Text style={styles.value}>{progress.hearts}</Text>
      </View>
      <View style={styles.stat}>
        <XpIcon size={24} />
        <Text style={styles.value}>{progress.xp} XP</Text>
      </View>
      <View style={styles.stat}>
        <StreakIcon size={24} />
        <Text style={styles.value}>{streak}</Text>
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
  stat: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
  },
  value: {
    color: colors.brown,
    fontSize: 16,
    fontWeight: '700',
  },
});
