import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { colors, radius, spacing } from '@/theme';

import type { ExerciseResult } from './types';

type FeedbackPanelProps = {
  result: ExerciseResult;
  continueLabel: string;
  onContinue: () => void;
};

export function FeedbackPanel({
  result,
  continueLabel,
  onContinue,
}: FeedbackPanelProps) {
  return (
    <View
      accessibilityLiveRegion="polite"
      style={[styles.panel, result.correct ? styles.good : styles.bad]}
    >
      <Text style={styles.title}>{result.correct ? 'Correct!' : 'Not quite'}</Text>
      {result.detail ? <Text style={styles.detail}>{result.detail}</Text> : null}
      <Button label={continueLabel} onPress={onContinue} />
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    borderRadius: radius.md,
    gap: spacing.sm,
    padding: spacing.md,
  },
  good: {
    backgroundColor: colors.tealLight,
  },
  bad: {
    backgroundColor: colors.rustLight,
  },
  title: {
    color: colors.brown,
    fontSize: 20,
    fontWeight: '800',
  },
  detail: {
    color: colors.brown,
    fontSize: 16,
    lineHeight: 24,
  },
});
