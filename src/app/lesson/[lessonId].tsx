import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

import { Button } from '@/components/Button';
import { LessonPlayer } from '@/components/LessonPlayer';
import { Screen } from '@/components/Screen';
import { isLessonUnlocked } from '@/progress/progress';
import { useProgress } from '@/progress/ProgressContext';
import { colors } from '@/theme';

export default function LessonScreen() {
  const router = useRouter();
  const { lessons, current } = useProgress();
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const lesson = lessons.find((candidate) => candidate.id === lessonId);

  if (!lesson || !isLessonUnlocked(lessons, current.completedLessons, lesson.id)) {
    return (
      <Screen>
        <Stack.Screen
          options={{ title: lesson ? 'Lesson locked' : 'Lesson not found' }}
        />
        <Text style={styles.body}>
          {lesson
            ? 'Finish the lesson before this one to unlock it.'
            : "We couldn't find that lesson."}
        </Text>
        <Button label="Back to lessons" onPress={() => router.replace('/learn')} />
      </Screen>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: lesson.title }} />
      <LessonPlayer key={lesson.id} lesson={lesson} />
    </>
  );
}

const styles = StyleSheet.create({
  body: {
    color: colors.brown,
    fontSize: 16,
    lineHeight: 24,
  },
});
