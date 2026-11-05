import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { LessonPath, type LessonStatus } from '@/components/LessonPath';
import { Screen } from '@/components/Screen';
import { StatsBar } from '@/components/StatsBar';
import { allLessons, spanishCourse } from '@/course/spanish';
import type { Lesson } from '@/course/types';
import { isLessonUnlocked } from '@/progress/progress';
import { useProgress } from '@/progress/ProgressContext';
import { colors, spacing } from '@/theme';

export default function HomeScreen() {
  const router = useRouter();
  const { progress } = useProgress();

  const statusFor = (lesson: Lesson): LessonStatus => {
    if (progress.completedLessons.includes(lesson.id)) return 'done';
    return isLessonUnlocked(allLessons, progress, lesson.id) ? 'open' : 'locked';
  };

  const mistakeCount = progress.mistakes.length;

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>Miso</Text>
        <Text style={styles.tagline}>
          Learn a language in a few minutes a day, completely free.
        </Text>
      </View>

      <StatsBar />

      <Text style={styles.courseTitle}>{spanishCourse.title}</Text>

      {spanishCourse.units.map((unit) => (
        <View key={unit.id}>
          <Text style={styles.unitTitle}>{unit.title}</Text>
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
        </View>
      ))}

      <Button
        label={
          mistakeCount > 0
            ? `Practice (${mistakeCount} to review)`
            : 'Practice'
        }
        variant="secondary"
        onPress={() => router.push('/practice')}
      />
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
  courseTitle: {
    color: colors.brown,
    fontSize: 24,
    fontWeight: '800',
  },
  unitTitle: {
    color: colors.brown,
    fontSize: 16,
    fontWeight: '700',
  },
});
