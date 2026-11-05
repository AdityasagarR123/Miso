import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, radius, spacing } from '@/theme';

type CardProps = {
  title: string;
  subtitle?: string;
  onPress: () => void;
};

export function Card({ title, subtitle, onPress }: CardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    gap: spacing.xs,
    padding: spacing.md,
  },
  pressed: {
    opacity: 0.8,
  },
  title: {
    color: colors.brown,
    fontSize: 18,
    fontWeight: '700',
  },
  subtitle: {
    color: colors.brown,
    fontSize: 14,
  },
});
