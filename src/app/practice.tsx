import { Redirect, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import { useAuth } from '@/auth/AuthContext';
import { Button } from '@/components/Button';
import { ExerciseView } from '@/components/exercises/ExerciseView';
import { FeedbackPanel } from '@/components/exercises/FeedbackPanel';
import type { ExerciseResult } from '@/components/exercises/types';
import { ProgressBar } from '@/components/ProgressBar';
import { Screen } from '@/components/Screen';
import { StatsBar } from '@/components/StatsBar';
import { shuffle } from '@/course/shuffle';
import { buildPracticeSet } from '@/progress/progress';
import { useProgress } from '@/progress/ProgressContext';
import { colors } from '@/theme';

const PRACTICE_LENGTH = 5;

export default function PracticeScreen() {
  const { course } = useProgress();
  const { user, loading } = useAuth();

  if (!course) return <Redirect href="/languages" />;
  if (loading) return <Screen>{null}</Screen>;
  if (!user) {
    return (
      <Redirect href={{ pathname: '/sign-in', params: { next: '/practice' } }} />
    );
  }
  return <PracticeSession />;
}

function PracticeSession() {
  const router = useRouter();
  const { progress, lessons, current, recordPracticeAnswer, finishPractice } =
    useProgress();
  const [exercises] = useState(() =>
    buildPracticeSet(lessons, current, PRACTICE_LENGTH, shuffle),
  );
  const [startHearts] = useState(progress.hearts);
  const [index, setIndex] = useState(0);
  const [result, setResult] = useState<ExerciseResult | null>(null);

  if (index >= exercises.length) {
    const earned = progress.hearts - startHearts;
    return (
      <Screen decorated>
        <ProgressBar progress={1} />
        <StatsBar large />
        <Text style={styles.title}>Practice complete!</Text>
        <Text style={styles.body}>
          You earned {earned} {earned === 1 ? 'heart' : 'hearts'}.
        </Text>
        <Button label="Back to lessons" onPress={() => router.replace('/learn')} />
      </Screen>
    );
  }

  const exercise = exercises[index];
  const isLast = index + 1 === exercises.length;

  return (
    <Screen decorated>
      <ProgressBar progress={(index + (result ? 1 : 0)) / exercises.length} />
      <StatsBar large />
      <ExerciseView
        key={exercise.id}
        exercise={exercise}
        locked={result !== null}
        onResult={(next) => {
          setResult(next);
          recordPracticeAnswer(exercise.id, next.correct);
        }}
      />
      {result ? (
        <FeedbackPanel
          result={result}
          continueLabel={isLast ? 'Finish' : 'Continue'}
          onContinue={() => {
            if (isLast) finishPractice();
            setResult(null);
            setIndex(index + 1);
          }}
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
