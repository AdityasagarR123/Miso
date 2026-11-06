import { Redirect, Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

import { useAuth } from '@/auth/AuthContext';
import { Button } from '@/components/Button';
import { LessonPlayer } from '@/components/LessonPlayer';
import { Screen } from '@/components/Screen';
import { isLessonUnlocked } from '@/progress/progress';
import { useProgress } from '@/progress/ProgressContext';
import { colors } from '@/theme';

export default function LessonScreen() {
  const router = useRouter();
  const { course, lessons, current } = useProgress();
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const lesson = lessons.find((candidate) => candidate.id === lessonId);
  const { user, loading } = useAuth();

  if (loading) return <Screen>{null}</Screen>;
  if (!user) {
    return (
      <Redirect
        href={{ pathname: '/sign-in', params: { next: `/lesson/${lessonId}` } }}
      />
    );
  }

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

  const levelId =
    course?.units.find((unit) =>
      unit.lessons.some((candidate) => candidate.id === lesson.id),
    )?.id ?? '';

  return (
    <>
      <Stack.Screen options={{ title: lesson.title }} />
      <LessonPlayer key={lesson.id} lesson={lesson} levelId={levelId} />
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
