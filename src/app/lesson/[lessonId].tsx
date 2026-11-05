import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

import { Button } from '@/components/Button';
import { ProgressBar } from '@/components/ProgressBar';
import { Screen } from '@/components/Screen';
import { spanishCourse } from '@/course/spanish';
import { colors } from '@/theme';

export default function LessonScreen() {
  const router = useRouter();
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const lesson = spanishCourse.units
    .flatMap((unit) => unit.lessons)
    .find((candidate) => candidate.id === lessonId);

  const goHome = () => router.replace('/');

  if (!lesson) {
    return (
      <Screen>
        <Stack.Screen options={{ title: 'Lesson not found' }} />
        <Text style={styles.body}>We couldn't find that lesson.</Text>
        <Button label="Back to lessons" onPress={goHome} />
      </Screen>
    );
  }

  return (
    <Screen>
      <Stack.Screen options={{ title: lesson.title }} />
      <ProgressBar progress={0} />
      <Text style={styles.title}>{lesson.title}</Text>
      <Text style={styles.body}>
        {lesson.exercises.length} exercises are ready. Lesson screens are coming
        next.
      </Text>
      <Button label="Back to lessons" variant="secondary" onPress={goHome} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.brown,
    fontSize: 28,
    fontWeight: '800',
  },
  body: {
    color: colors.brown,
    fontSize: 16,
    lineHeight: 24,
  },
});
