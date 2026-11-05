import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { MatchPairs } from '@/components/exercises/MatchPairs';
import { MultipleChoice } from '@/components/exercises/MultipleChoice';
import { Translate } from '@/components/exercises/Translate';
import type { ExerciseResult } from '@/components/exercises/types';
import { ProgressBar } from '@/components/ProgressBar';
import { Screen } from '@/components/Screen';
import type { Exercise, Lesson } from '@/course/types';
import { colors, radius, spacing } from '@/theme';

type ExerciseViewProps = {
  exercise: Exercise;
  locked: boolean;
  onResult: (result: ExerciseResult) => void;
};

function ExerciseView({ exercise, locked, onResult }: ExerciseViewProps) {
  switch (exercise.type) {
    case 'multiple_choice':
      return (
        <MultipleChoice exercise={exercise} locked={locked} onResult={onResult} />
      );
    case 'match_pairs':
      return <MatchPairs exercise={exercise} locked={locked} onResult={onResult} />;
    case 'translate':
      return <Translate exercise={exercise} locked={locked} onResult={onResult} />;
  }
}

export function LessonPlayer({ lesson }: { lesson: Lesson }) {
  const router = useRouter();
  const [attempt, setAttempt] = useState(0);
  const [index, setIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [result, setResult] = useState<ExerciseResult | null>(null);

  const total = lesson.exercises.length;
  const finished = index >= total;

  const handleResult = (next: ExerciseResult) => {
    setResult(next);
    if (next.correct) setCorrectCount(correctCount + 1);
  };

  const goToNext = () => {
    setResult(null);
    setIndex(index + 1);
  };

  const restart = () => {
    setAttempt(attempt + 1);
    setIndex(0);
    setCorrectCount(0);
    setResult(null);
  };

  if (finished) {
    return (
      <Screen>
        <ProgressBar progress={1} />
        <Text style={styles.title}>Lesson complete!</Text>
        <Text style={styles.body}>
          You got {correctCount} of {total} right in {lesson.title}.
        </Text>
        <Button label="Back to lessons" onPress={() => router.replace('/')} />
        <Button label="Practice again" variant="secondary" onPress={restart} />
      </Screen>
    );
  }

  const exercise = lesson.exercises[index];
  const progress = (index + (result ? 1 : 0)) / total;

  return (
    <Screen>
      <ProgressBar progress={progress} />
      <ExerciseView
        key={`${attempt}-${exercise.id}`}
        exercise={exercise}
        locked={result !== null}
        onResult={handleResult}
      />
      {result ? (
        <View
          accessibilityLiveRegion="polite"
          style={[styles.feedback, result.correct ? styles.good : styles.bad]}
        >
          <Text style={styles.feedbackTitle}>
            {result.correct ? 'Correct!' : 'Not quite'}
          </Text>
          {result.detail ? <Text style={styles.body}>{result.detail}</Text> : null}
          <Button
            label={index + 1 === total ? 'Finish' : 'Continue'}
            onPress={goToNext}
          />
        </View>
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
  feedback: {
    borderRadius: radius.md,
    gap: spacing.sm,
    padding: spacing.md,
  },
  good: {
    backgroundColor: colors.tealLight,
  },
  bad: {
    backgroundColor: colors.rustLight,
  },
  feedbackTitle: {
    color: colors.brown,
    fontSize: 20,
    fontWeight: '800',
  },
});
