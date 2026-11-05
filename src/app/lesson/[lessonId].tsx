import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

import { Button } from '@/components/Button';
import { LessonPlayer } from '@/components/LessonPlayer';
import { Screen } from '@/components/Screen';
import { spanishCourse } from '@/course/spanish';
import { colors } from '@/theme';

export default function LessonScreen() {
  const router = useRouter();
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const lesson = spanishCourse.units
    .flatMap((unit) => unit.lessons)
    .find((candidate) => candidate.id === lessonId);

  if (!lesson) {
    return (
      <Screen>
        <Stack.Screen options={{ title: 'Lesson not found' }} />
        <Text style={styles.body}>We couldn't find that lesson.</Text>
        <Button label="Back to lessons" onPress={() => router.replace('/')} />
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
