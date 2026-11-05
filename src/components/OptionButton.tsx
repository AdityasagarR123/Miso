import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, radius, spacing } from '@/theme';

export type OptionStatus = 'idle' | 'selected' | 'correct' | 'wrong';

type OptionButtonProps = {
  label: string;
  onPress: () => void;
  status?: OptionStatus;
  disabled?: boolean;
};

export function OptionButton({
  label,
  onPress,
  status = 'idle',
  disabled = false,
}: OptionButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled, selected: status === 'selected' }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.option,
        styles[status],
        pressed && styles.pressed,
      ]}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  option: {
    alignItems: 'center',
    borderRadius: radius.md,
    borderWidth: 2,
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  idle: {
    backgroundColor: colors.white,
    borderColor: colors.border,
  },
  selected: {
    backgroundColor: colors.tealLight,
    borderColor: colors.tealDark,
  },
  correct: {
    backgroundColor: colors.tealLight,
    borderColor: colors.tealDark,
  },
  wrong: {
    backgroundColor: colors.rustLight,
    borderColor: colors.rustDark,
  },
  pressed: {
    opacity: 0.8,
  },
  label: {
    color: colors.brown,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
