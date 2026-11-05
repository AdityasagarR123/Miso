import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import {
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import { Button } from '@/components/Button';
import { themeForCourse } from '@/components/map/mapThemes';
import { RoadMap, type RoadStop } from '@/components/map/RoadMap';
import { Screen } from '@/components/Screen';
import { StatsBar } from '@/components/StatsBar';
import { LEVEL_PLAN } from '@/course/levels';
import { currentStopIndex, isLessonUnlocked } from '@/progress/progress';
import { useProgress } from '@/progress/ProgressContext';
import { colors, spacing } from '@/theme';

export default function LevelScreen() {
  const router = useRouter();
  const { course, lessons, current } = useProgress();
  const { levelId } = useLocalSearchParams<{ levelId: string }>();
  const { width, height } = useWindowDimensions();

  const level = LEVEL_PLAN.find((item) => item.id === levelId);
  const unit = course?.units.find((item) => item.id === levelId);

  if (!course || !level || !unit) {
    return (
      <Screen>
        <Stack.Screen options={{ title: 'Level not found' }} />
        <Text style={styles.body}>We couldn't find that level.</Text>
        <Button label="Back to levels" onPress={() => router.replace('/learn')} />
      </Screen>
    );
  }

  const theme = themeForCourse(course.id);
  const isWide = width >= 800;

  const statuses = unit.lessons.map((lesson) => {
    if (current.completedLessons.includes(lesson.id)) return 'done' as const;
    return isLessonUnlocked(lessons, current.completedLessons, lesson.id)
      ? ('open' as const)
      : ('locked' as const);
  });

  const stops: RoadStop[] = unit.lessons.map((lesson, index) => {
    const status = statuses[index];
    return {
      key: lesson.id,
      number: index + 1,
      caption: lesson.title,
      tooltipTitle: `Lesson ${index + 1}: ${lesson.title}`,
      tooltipStatus:
        status === 'done'
          ? 'Completed'
          : status === 'open'
            ? 'Ready to play'
            : 'Finish the lesson before this one',
      status,
      onPress:
        status === 'locked'
          ? undefined
          : () =>
              router.push({
                pathname: '/lesson/[lessonId]',
                params: { lessonId: lesson.id },
              }),
    };
  });

  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={[
        styles.page,
        { minHeight: height - HEADER_HEIGHT },
      ]}
    >
      <Stack.Screen
        options={{
          contentStyle: { backgroundColor: theme.background },
          headerStyle: { backgroundColor: theme.background },
          title: `Level ${level.number}: ${level.title}`,
        }}
      />

      <View style={styles.stats}>
        <StatsBar />
      </View>

      <RoadMap
        theme={theme}
        stops={stops}
        markerIndex={currentStopIndex(statuses)}
        reservedHeight={HEADER_HEIGHT + (isWide ? 72 : 76)}
        showBanners={false}
      />
    </ScrollView>
  );
}

const HEADER_HEIGHT = 64;

const styles = StyleSheet.create({
  page: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingBottom: spacing.md,
    paddingHorizontal: 12,
    paddingTop: spacing.sm,
  },
  stats: {
    maxWidth: 420,
    width: '100%',
  },
  body: {
    color: colors.brown,
    fontSize: 16,
    lineHeight: 24,
  },
});
