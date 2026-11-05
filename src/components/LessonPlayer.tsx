import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import { Button } from '@/components/Button';
import { ExerciseView } from '@/components/exercises/ExerciseView';
import { FeedbackPanel } from '@/components/exercises/FeedbackPanel';
import type { ExerciseResult } from '@/components/exercises/types';
import { ProgressBar } from '@/components/ProgressBar';
import { Screen } from '@/components/Screen';
import { StatsBar } from '@/components/StatsBar';
import type { Lesson } from '@/course/types';
import { XP_FOR_FIRST_COMPLETION, XP_PER_CORRECT } from '@/progress/progress';
import { useProgress } from '@/progress/ProgressContext';
import { colors } from '@/theme';

export function LessonPlayer({ lesson }: { lesson: Lesson }) {
  const router = useRouter();
  const { progress, current, recordLessonAnswer, finishLesson } = useProgress();
  const [attempt, setAttempt] = useState(0);
  const [index, setIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [result, setResult] = useState<ExerciseResult | null>(null);
  const [bonusXp, setBonusXp] = useState(0);

  const total = lesson.exercises.length;

  if (index >= total) {
    return (
      <Screen>
        <ProgressBar progress={1} />
        <StatsBar />
        <Text style={styles.title}>Lesson complete!</Text>
        <Text style={styles.body}>
          You got {correctCount} of {total} right in {lesson.title} and earned{' '}
          {correctCount * XP_PER_CORRECT + bonusXp} XP.
        </Text>
        <Button label="Back to lessons" onPress={() => router.replace('/learn')} />
        <Button
          label="Practice again"
          variant="secondary"
          onPress={() => {
            setAttempt(attempt + 1);
            setIndex(0);
            setCorrectCount(0);
            setResult(null);
            setBonusXp(0);
          }}
        />
      </Screen>
    );
  }

  if (progress.hearts === 0 && !result) {
    return (
      <Screen>
        <StatsBar />
        <Text style={styles.title}>Out of hearts</Text>
        <Text style={styles.body}>
          Practice for free to earn hearts back, then try this lesson again.
        </Text>
        <Button label="Practice" onPress={() => router.replace('/practice')} />
        <Button
          label="Back to lessons"
          variant="secondary"
          onPress={() => router.replace('/learn')}
        />
      </Screen>
    );
  }

  const exercise = lesson.exercises[index];
  const isLast = index + 1 === total;

  const handleResult = (next: ExerciseResult) => {
    setResult(next);
    recordLessonAnswer(exercise.id, next.correct);
    if (next.correct) setCorrectCount(correctCount + 1);
  };

  const goToNext = () => {
    if (isLast) {
      if (!current.completedLessons.includes(lesson.id)) {
        setBonusXp(XP_FOR_FIRST_COMPLETION);
      }
      finishLesson(lesson.id);
    }
    setResult(null);
    setIndex(index + 1);
  };

  return (
    <Screen>
      <ProgressBar progress={(index + (result ? 1 : 0)) / total} />
      <StatsBar />
      <ExerciseView
        key={`${attempt}-${exercise.id}`}
        exercise={exercise}
        locked={result !== null}
        onResult={handleResult}
      />
      {result ? (
        <FeedbackPanel
          result={result}
          continueLabel={isLast ? 'Finish' : 'Continue'}
          onContinue={goToNext}
        />
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.brown,
    fontSize: 32,
    fontWeight: '800',
  },
  body: {
    color: colors.brown,
    fontSize: 16,
    lineHeight: 24,
  },
});
