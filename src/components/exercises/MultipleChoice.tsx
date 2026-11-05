import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { OptionButton, type OptionStatus } from '@/components/OptionButton';
import { shuffle } from '@/course/shuffle';
import type { MultipleChoiceExercise } from '@/course/types';
import { colors, spacing } from '@/theme';

import type { ExerciseProps } from './types';

export function MultipleChoice({
  exercise,
  locked,
  onResult,
}: ExerciseProps<MultipleChoiceExercise>) {
  const [choices] = useState(() => shuffle(exercise.choices));
  const [selected, setSelected] = useState<string | null>(null);

  const statusFor = (choice: string): OptionStatus => {
    if (locked && choice === exercise.answer) return 'correct';
    if (locked && choice === selected) return 'wrong';
    return choice === selected ? 'selected' : 'idle';
  };

  const check = () => {
    const correct = selected === exercise.answer;
    onResult({
      correct,
      detail: correct ? undefined : `Correct answer: ${exercise.answer}`,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.prompt}>{exercise.prompt}</Text>
      <View style={styles.choices}>
        {choices.map((choice) => (
          <OptionButton
            key={choice}
            label={choice}
            status={statusFor(choice)}
            disabled={locked}
            onPress={() => setSelected(choice)}
          />
        ))}
      </View>
      {locked ? null : (
        <Button label="Check" disabled={selected === null} onPress={check} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
  },
  prompt: {
    color: colors.brown,
    fontSize: 24,
    fontWeight: '800',
  },
  choices: {
    gap: spacing.sm,
  },
});
