import { Redirect, useRouter } from 'expo-router';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import { useAuth } from '@/auth/AuthContext';
import { Button } from '@/components/Button';
import { themeForCourse } from '@/components/map/mapThemes';
import { RoadMap, type RoadStop } from '@/components/map/RoadMap';
import { StatsBar } from '@/components/StatsBar';
import { LEVEL_PLAN } from '@/course/levels';
import { currentStopIndex, levelStatus } from '@/progress/progress';
import { useProgress } from '@/progress/ProgressContext';
import { colors, radius, spacing } from '@/theme';

const LOGO_HEAD = require('../../assets/brand/biso-head.png');

const STATUS_TEXT = {
  done: 'Completed',
  open: 'Ready to play',
  locked: 'Locked',
  soon: 'Coming soon',
};

export default function LearnScreen() {
  const router = useRouter();
  const { course, lessons, current } = useProgress();
  const { user } = useAuth();
  const { width, height } = useWindowDimensions();

  if (!course) return <Redirect href="/languages" />;

  const theme = themeForCourse(course.id);
  const isWide = width >= 800;

  const statuses = LEVEL_PLAN.map((level) => {
    const unit = course.units.find((candidate) => candidate.id === level.id);
    return levelStatus(unit?.lessons ?? [], lessons, current.completedLessons);
  });

  const stops: RoadStop[] = LEVEL_PLAN.map((level, index) => {
    const status = statuses[index];
    const playable = status === 'open' || status === 'done';
    return {
      key: level.id,
      number: level.number,
      caption: level.title,
      tooltipTitle: `Level ${level.number}: ${level.title}`,
      tooltipStatus: STATUS_TEXT[status],
      status: status === 'soon' ? 'locked' : status,
      onPress: playable
        ? () =>
            router.push({
              pathname: '/level/[levelId]',
              params: { levelId: level.id },
            })
        : undefined,
    };
  });

  const mistakeCount = current.mistakes.length;

  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={[styles.page, { minHeight: height }]}
    >
      <View style={styles.bar}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go to the Biso home page"
          onPress={() => router.push('/')}
          style={styles.brand}
        >
          <Image source={LOGO_HEAD} resizeMode="contain" style={styles.logo} />
          <Text style={[styles.courseTitle, { color: theme.accent }]}>
            {course.title}
          </Text>
        </Pressable>

        {isWide ? (
          <View style={styles.stats}>
            <StatsBar />
          </View>
        ) : null}

        <View style={styles.actions}>
          <Button
            label={mistakeCount > 0 ? `Practice (${mistakeCount})` : 'Practice'}
            onPress={() => router.push('/practice')}
          />
          <Button
            label="Change language"
            variant="secondary"
            onPress={() => router.push('/languages')}
          />
          <Button
            label={user ? 'Account' : 'Sign in'}
            variant="secondary"
            onPress={() =>
              user
                ? router.push('/account')
                : router.push({ pathname: '/sign-in', params: { next: '/learn' } })
            }
          />
        </View>

        {isWide ? null : (
          <View style={styles.statsNarrow}>
            <StatsBar />
          </View>
        )}
      </View>

      <RoadMap
        theme={theme}
        stops={stops}
        markerIndex={currentStopIndex(statuses)}
        reservedHeight={isWide ? 104 : 256}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingBottom: spacing.md,
    paddingHorizontal: 12,
    paddingTop: spacing.sm,
  },
  bar: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderBottomWidth: 4,
    borderColor: colors.brown,
    borderRadius: radius.lg,
    borderWidth: 2,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'space-between',
    maxWidth: 1040,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    width: '100%',
  },
  brand: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  logo: {
    height: 40,
    width: 40,
  },
  courseTitle: {
    fontSize: 22,
    fontWeight: '800',
  },
  stats: {
    minWidth: 220,
  },
  statsNarrow: {
    width: '100%',
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
});
