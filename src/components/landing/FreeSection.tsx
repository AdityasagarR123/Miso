import {
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  type ViewStyle,
} from 'react-native';

import { colors, radius, spacing } from '@/theme';

const WIDE_BREAKPOINT = 900;

// A soft web shadow. Phones ignore it.
const CARD_SHADOW = {
  boxShadow: '0 10px 24px rgba(59, 35, 24, 0.12)',
} as ViewStyle;

const PROMISES = [
  {
    title: 'No subscriptions',
    text: 'Nothing renews, because nothing is ever billed.',
  },
  {
    title: 'No premium tier',
    text: 'Everyone learns from the same lessons.',
  },
  {
    title: 'No paywalled lessons',
    text: 'All 10 levels open up as you play, not as you pay.',
  },
  {
    title: 'No paying after mistakes',
    text: 'Out of hearts? Practice earns them back.',
  },
];

export function FreeSection() {
  const { width } = useWindowDimensions();
  const isWide = width >= WIDE_BREAKPOINT;
  const twoColumns = width >= 560;
  const titleSize = isWide ? 72 : 48;
  const padding = isWide ? 96 : 64;

  return (
    <View
      style={[
        styles.band,
        {
          paddingBottom: padding + 48,
          paddingHorizontal: isWide ? 32 : 16,
          paddingTop: padding,
        },
      ]}
    >
      <View style={[styles.inner, isWide && styles.innerWide]}>
        <View style={[styles.copy, isWide && styles.copyWide]}>
          <Text
            accessibilityRole="header"
            aria-level={2}
            style={[
              styles.title,
              { fontSize: titleSize, lineHeight: Math.round(titleSize * 1.05) },
            ]}
          >
            Free means free.
          </Text>
          <Text style={styles.lead}>
            No card, no trial and no catch. You pay nothing to start and nothing
            to finish. All you need is a free account.
          </Text>
        </View>

        <View style={[styles.grid, isWide && styles.gridWide]}>
          {PROMISES.map(({ title, text }) => (
            <View
              key={title}
              style={[
                styles.promise,
                CARD_SHADOW,
                { flexBasis: twoColumns ? '45%' : '100%' },
              ]}
            >
              <View style={styles.mark}>
                <Text style={styles.markText}>✓</Text>
              </View>
              <Text style={styles.promiseTitle}>{title}</Text>
              <Text style={styles.promiseText}>{text}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  band: {
    alignItems: 'center',
    backgroundColor: colors.rustDark,
    width: '100%',
  },
  inner: {
    gap: spacing.lg,
    maxWidth: 1120,
    width: '100%',
  },
  innerWide: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 56,
  },
  copy: {
    gap: spacing.md,
  },
  copyWide: {
    flex: 4,
  },
  title: {
    color: colors.white,
    fontWeight: '800',
    letterSpacing: -1,
  },
  lead: {
    color: colors.white,
    fontSize: 19,
    lineHeight: 29,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  gridWide: {
    flex: 6,
  },
  promise: {
    backgroundColor: colors.cream,
    borderRadius: radius.lg,
    flexGrow: 1,
    gap: spacing.sm,
    padding: spacing.lg,
  },
  mark: {
    alignItems: 'center',
    backgroundColor: colors.tealDark,
    borderRadius: radius.pill,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  markText: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '800',
  },
  promiseTitle: {
    color: colors.brown,
    fontSize: 21,
    fontWeight: '800',
    lineHeight: 27,
  },
  promiseText: {
    color: colors.brown,
    fontSize: 16,
    lineHeight: 24,
  },
});
