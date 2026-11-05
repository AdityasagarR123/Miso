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
    backgroundColor: '#EFE3CC',
    borderColor: '#EFE3CC',
    borderRadius: radius.pill,
    borderWidth: 3,
    height: 20,
    overflow: 'hidden',
  },
  fill: {
    backgroundColor: colors.tealDark,
    borderRadius: radius.pill,
    height: '100%',
  },
});
