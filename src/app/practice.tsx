import { Redirect, Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@/auth/AuthContext';
import { Button } from '@/components/Button';
import { Congrats } from '@/components/Congrats';
import { ExerciseView } from '@/components/exercises/ExerciseView';
import { FeedbackPanel } from '@/components/exercises/FeedbackPanel';
import type { ExerciseResult } from '@/components/exercises/types';
import { ProgressBar } from '@/components/ProgressBar';
import { Screen } from '@/components/Screen';
import { StatsBar } from '@/components/StatsBar';
import { shuffle } from '@/course/shuffle';
import type { LessonKind } from '@/course/types';
import { buildPracticeSet } from '@/progress/progress';
import { useProgress } from '@/progress/ProgressContext';
import { colors, radius, spacing } from '@/theme';

const LOGO_HEAD = require('../../assets/brand/biso-head.png');
const PRACTICE_LENGTH = 5;

type Mode = 'mixed' | Extract<LessonKind, 'grammar' | 'writing'>;

const MODES: { mode: Mode; title: string; description: string }[] = [
  {
    mode: 'mixed',
    title: 'Mixed practice',
    description: 'Your past mistakes first, then a bit of everything.',
  },
  {
    mode: 'grammar',
    title: 'Grammar',
    description: 'Practice how sentences fit together.',
  },
  {
    mode: 'writing',
    title: 'Writing',
    description: 'Type phrases from memory.',
  },
];

function isMode(value: unknown): value is Mode {
  return MODES.some((item) => item.mode === value);
}

export default function PracticeScreen() {
  const { course } = useProgress();
  const { user, loading } = useAuth();
  const { mode } = useLocalSearchParams<{ mode?: string }>();

  if (!course) return <Redirect href="/languages" />;
  if (loading) return <Screen>{null}</Screen>;
  if (!user) {
    return (
      <Redirect href={{ pathname: '/sign-in', params: { next: '/practice' } }} />
    );
  }
  return isMode(mode) ? <PracticeSession key={mode} mode={mode} /> : <PracticeHub />;
}

function PracticeHub() {
  const router = useRouter();
  const { current } = useProgress();
  const mistakes = current.mistakes.length;

  return (
    <Screen decorated>
      <Stack.Screen options={{ title: 'Practice' }} />
      <StatsBar large />
      <View style={styles.hubHeader}>
        <Image
          accessibilityLabel="Biso the red panda"
          source={LOGO_HEAD}
          resizeMode="contain"
          style={styles.hubFace}
        />
        <Text accessibilityRole="header" style={styles.title}>
          What should we practice?
        </Text>
        <Text style={styles.body}>Each session is 5 questions and earns hearts back.</Text>
      </View>

      {MODES.map(({ mode, title, description }) => (
        <Pressable
          key={mode}
          accessibilityRole="button"
          onPress={() =>
            router.push({ pathname: '/practice', params: { mode } })
          }
          style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
        >
          <Text style={styles.cardTitle}>
            {mode === 'mixed' && mistakes > 0 ? `${title} (${mistakes})` : title}
          </Text>
          <Text style={styles.cardBody}>{description}</Text>
        </Pressable>
      ))}
    </Screen>
  );
}

function PracticeSession({ mode }: { mode: Mode }) {
  const router = useRouter();
  const { progress, lessons, current, recordPracticeAnswer, finishPractice } =
    useProgress();
  const [exercises] = useState(() =>
    buildPracticeSet(
      lessons,
      current,
      PRACTICE_LENGTH,
      shuffle,
      mode === 'mixed' ? undefined : mode,
    ),
  );
  const [startHearts] = useState(progress.hearts);
  const [index, setIndex] = useState(0);
  const [result, setResult] = useState<ExerciseResult | null>(null);
  const title = MODES.find((item) => item.mode === mode)?.title ?? 'Practice';

  if (index >= exercises.length) {
    const earned = progress.hearts - startHearts;
    return (
      <Screen decorated>
        <Stack.Screen options={{ title }} />
        <ProgressBar progress={1} />
        <StatsBar large />
        <Congrats
          title="Practice complete!"
          message={`Biso loved that! You earned ${earned} ${earned === 1 ? 'heart' : 'hearts'}.`}
        />
        <Button label="Practice more" onPress={() => router.replace('/practice')} />
        <Button
          label="Back to levels"
          variant="secondary"
          onPress={() => router.replace('/learn')}
        />
      </Screen>
    );
  }

  const exercise = exercises[index];
  const isLast = index + 1 === exercises.length;

  return (
    <Screen decorated>
      <Stack.Screen options={{ title }} />
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
  hubHeader: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  hubFace: {
    height: 96,
    width: 112,
  },
  title: {
    color: colors.brown,
    fontSize: 30,
    fontWeight: '800',
    textAlign: 'center',
  },
  body: {
    color: colors.brown,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  card: {
    backgroundColor: colors.white,
    borderBottomWidth: 6,
    borderColor: colors.brown,
    borderRadius: radius.md,
    borderWidth: 2,
    gap: spacing.xs,
    minHeight: 84,
    padding: spacing.md,
  },
  cardPressed: {
    opacity: 0.85,
  },
  cardTitle: {
    color: colors.brown,
    fontSize: 20,
    fontWeight: '800',
  },
  cardBody: {
    color: colors.brown,
    fontSize: 15,
    lineHeight: 22,
  },
});
