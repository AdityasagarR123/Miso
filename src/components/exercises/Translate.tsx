import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { OptionButton } from '@/components/OptionButton';
import { shuffle } from '@/course/shuffle';
import type { TranslateExercise } from '@/course/types';
import { colors, radius, spacing } from '@/theme';

import type { ExerciseProps } from './types';

type BankWord = { id: number; text: string };

export function Translate({
  exercise,
  locked,
  onResult,
}: ExerciseProps<TranslateExercise>) {
  const [bank] = useState<BankWord[]>(() =>
    shuffle(exercise.wordBank.map((text, id) => ({ id, text }))),
  );
  const [picked, setPicked] = useState<BankWord[]>([]);

  const check = () => {
    const sentence = picked.map((word) => word.text).join(' ');
    const correct = exercise.answers.includes(sentence);
    onResult({
      correct,
      detail: correct ? undefined : `Correct answer: ${exercise.answers[0]}`,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.prompt}>{exercise.prompt}</Text>
      <Text style={styles.text}>{exercise.text}</Text>

      <View style={styles.answer}>
        {picked.map((word) => (
          <OptionButton
            key={word.id}
            label={word.text}
            disabled={locked}
            onPress={() =>
              setPicked(picked.filter((other) => other.id !== word.id))
            }
          />
        ))}
      </View>

      <View style={styles.bank}>
        {bank
          .filter((word) => !picked.some((other) => other.id === word.id))
          .map((word) => (
            <OptionButton
              key={word.id}
              label={word.text}
              disabled={locked}
              onPress={() => setPicked([...picked, word])}
            />
          ))}
      </View>

      {locked ? null : (
        <Button label="Check" disabled={picked.length === 0} onPress={check} />
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
  text: {
    color: colors.brown,
    fontSize: 20,
  },
  answer: {
    borderBottomColor: colors.border,
    borderBottomWidth: 2,
    borderRadius: radius.md,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    minHeight: 64,
    paddingBottom: spacing.sm,
  },
  bank: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
});
