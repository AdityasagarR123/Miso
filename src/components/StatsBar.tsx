import { StyleSheet, Text, View } from 'react-native';

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
      <Text style={styles.stat}>❤️ {progress.hearts}</Text>
      <Text style={styles.stat}>⭐ {progress.xp} XP</Text>
      <Text style={styles.stat}>🔥 {streak}</Text>
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
    color: colors.brown,
    fontSize: 16,
    fontWeight: '700',
  },
});
