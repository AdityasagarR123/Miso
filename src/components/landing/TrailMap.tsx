import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import { LANDING_THEME_COUNT, MAP_THEMES } from '@/components/map/mapThemes';
import { RoadMap, type RoadStop } from '@/components/map/RoadMap';
import { LEVEL_PLAN } from '@/course/levels';
import { colors, radius, spacing } from '@/theme';

type TrailMapProps = {
  startLabel: string;
  onStart: (courseId: string) => void;
};

/** The landing page's map: a preview of all five language worlds. */
export function TrailMap({ startLabel, onStart }: TrailMapProps) {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const [themeIndex, setThemeIndex] = useState(0);
  const theme = MAP_THEMES[themeIndex];
  const isWide = width >= 800;

  const stops: RoadStop[] = LEVEL_PLAN.map((level) => {
    const available = level.number === 1;
    return {
      key: `${theme.courseId}-${level.id}`,
      number: level.number,
      caption: level.title,
      tooltipTitle: `Level ${level.number}: ${level.title}`,
      tooltipStatus: available ? startLabel : 'Unlocks as you play',
      status: available ? 'open' : 'locked',
      onPress: available ? () => onStart(theme.courseId) : undefined,
    };
  });

  return (
    <View
      style={[
        styles.section,
        {
          backgroundColor: theme.background,
          minHeight: Math.max(height, 560),
          paddingHorizontal: isWide ? 12 : spacing.md,
        },
      ]}
    >
      <Text
        accessibilityRole="header"
        aria-level={2}
        style={[styles.title, !isWide && styles.titleSmall]}
      >
        Your <Text style={{ color: theme.accent }}>{theme.title}</Text> journey
        starts here
      </Text>

      <View style={styles.tabs}>
        {MAP_THEMES.slice(0, LANDING_THEME_COUNT).map((item, index) => {
          const selected = index === themeIndex;
          return (
            <Pressable
              key={item.courseId}
              accessibilityRole="button"
              accessibilityLabel={`Show the ${item.title} map`}
              accessibilityState={{ selected }}
              onPress={() => setThemeIndex(index)}
              style={[
                styles.tab,
                selected && { backgroundColor: theme.accent, borderColor: theme.accent },
              ]}
            >
              <Text style={[styles.tabText, selected && styles.tabTextSelected]}>
                {item.title}
              </Text>
            </Pressable>
          );
        })}
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/languages')}
          style={styles.tab}
        >
          <Text style={styles.tabText}>All 10 languages</Text>
        </Pressable>
      </View>

      <RoadMap
        theme={theme}
        stops={stops}
        markerIndex={0}
        reservedHeight={isWide ? 260 : 212}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    alignItems: 'center',
    gap: spacing.sm,
    justifyContent: 'center',
    overflow: 'hidden',
    paddingBottom: spacing.md,
    paddingTop: 88,
    width: '100%',
  },
  title: {
    color: colors.brown,
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -0.5,
    lineHeight: 42,
    textAlign: 'center',
  },
  titleSmall: {
    fontSize: 24,
    lineHeight: 30,
  },
  tabs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    justifyContent: 'center',
  },
  tab: {
    backgroundColor: colors.white,
    borderColor: colors.brown,
    borderRadius: radius.pill,
    borderWidth: 2,
    justifyContent: 'center',
    minHeight: 36,
    paddingHorizontal: spacing.md,
  },
  tabText: {
    color: colors.brown,
    fontSize: 14,
    fontWeight: '700',
  },
  tabTextSelected: {
    color: colors.white,
  },
});
