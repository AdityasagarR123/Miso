import { Redirect, useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { LessonPath, type LessonStatus } from '@/components/LessonPath';
import { Screen } from '@/components/Screen';
import { StatsBar } from '@/components/StatsBar';
import { LEVEL_PLAN } from '@/course/levels';
import type { Lesson } from '@/course/types';
import { isLessonUnlocked } from '@/progress/progress';
import { useProgress } from '@/progress/ProgressContext';
import { colors, radius, spacing } from '@/theme';

export default function HomeScreen() {
  const router = useRouter();
  const { course, lessons, current } = useProgress();

  if (!course) return <Redirect href="/languages" />;

  const statusFor = (lesson: Lesson): LessonStatus => {
    if (current.completedLessons.includes(lesson.id)) return 'done';
    return isLessonUnlocked(lessons, current.completedLessons, lesson.id)
      ? 'open'
      : 'locked';
  };

  const mistakeCount = current.mistakes.length;

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>Viso</Text>
        <Text style={styles.tagline}>
          Learn a language in a few minutes a day, completely free.
        </Text>
      </View>

      <StatsBar />

      <View style={styles.courseRow}>
        <Text style={styles.courseTitle}>{course.title}</Text>
        <Button
          label="Change language"
          variant="secondary"
          onPress={() => router.push('/languages')}
        />
      </View>

      <Button
        label={
          mistakeCount > 0
            ? `Practice (${mistakeCount} to review)`
            : 'Practice'
        }
        onPress={() => router.push('/practice')}
      />

      {LEVEL_PLAN.map((level) => {
        const unit = course.units.find((candidate) => candidate.id === level.id);

        return (
          <View key={level.id} style={styles.level}>
            <Text style={styles.levelRegion}>{level.region}</Text>
            <Text style={styles.levelTitle}>
              Level {level.number}: {level.title}
            </Text>
            {unit ? (
              <LessonPath
                lessons={unit.lessons}
                statusFor={statusFor}
                onSelect={(lesson) =>
                  router.push({
                    pathname: '/lesson/[lessonId]',
                    params: { lessonId: lesson.id },
                  })
                }
              />
            ) : (
              <View style={styles.comingSoon}>
                <Text style={styles.comingSoonText}>Coming soon</Text>
              </View>
            )}
          </View>
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  title: {
    color: colors.rustDark,
    fontSize: 40,
    fontWeight: '800',
  },
  tagline: {
    color: colors.brown,
    fontSize: 16,
    lineHeight: 24,
  },
  courseRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  courseTitle: {
    color: colors.brown,
    fontSize: 24,
    fontWeight: '800',
  },
  level: {
    gap: spacing.xs,
  },
  levelRegion: {
    color: colors.tealDark,
    fontSize: 14,
    fontWeight: '700',
  },
  levelTitle: {
    color: colors.brown,
    fontSize: 18,
    fontWeight: '800',
  },
  comingSoon: {
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 2,
    padding: spacing.md,
  },
  comingSoonText: {
    color: colors.brown,
    fontSize: 16,
    textAlign: 'center',
  },
});
