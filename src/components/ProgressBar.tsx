import { StyleSheet, View } from 'react-native';

import { colors, radius } from '@/theme';

type ProgressBarProps = {
  /** Progress from 0 to 1. Values outside that range are clamped. */
  progress: number;
};

export function ProgressBar({ progress }: ProgressBarProps) {
  const clamped = Math.min(Math.max(progress, 0), 1);
  const percent = Math.round(clamped * 100);

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: percent }}
      style={styles.track}
    >
      <View style={[styles.fill, { width: `${percent}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    backgroundColor: colors.white,
    borderRadius: radius.pill,
    height: 12,
    overflow: 'hidden',
  },
  fill: {
    backgroundColor: colors.teal,
    height: '100%',
  },
});
