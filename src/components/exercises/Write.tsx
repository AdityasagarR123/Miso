import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { Button } from '@/components/Button';
import type { WriteExercise } from '@/course/types';
import { isWritingCorrect } from '@/course/writing';
import { colors, radius, spacing } from '@/theme';

import type { ExerciseProps } from './types';

export function Write({ exercise, locked, onResult }: ExerciseProps<WriteExercise>) {
  const [text, setText] = useState('');

  const check = () => {
    if (locked || text.trim().length === 0) return;
    const correct = isWritingCorrect(text, exercise.answers);
    onResult({
      correct,
      detail: correct
        ? undefined
        : `Correct answer: ${exercise.answers.join(' or ')}`,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.prompt}>{exercise.prompt}</Text>
      <Text style={styles.text}>{exercise.text}</Text>
      <TextInput
        accessibilityLabel="Your answer"
        autoCapitalize="none"
        autoCorrect={false}
        editable={!locked}
        onChangeText={setText}
        onSubmitEditing={check}
        placeholder="Type your answer"
        placeholderTextColor="#8A7566"
        style={styles.input}
        value={text}
      />
      {exercise.hint ? <Text style={styles.hint}>{exercise.hint}</Text> : null}
      {locked ? null : (
        <Button label="Check" disabled={text.trim().length === 0} onPress={check} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  prompt: {
    color: colors.brown,
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 36,
    textAlign: 'center',
  },
  text: {
    color: colors.tealDark,
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#FFF9EE',
    borderBottomWidth: 6,
    borderColor: colors.brown,
    borderRadius: radius.md,
    borderWidth: 2,
    color: colors.brown,
    fontSize: 20,
    minHeight: 60,
    paddingHorizontal: spacing.md,
    textAlign: 'center',
  },
  hint: {
    color: colors.brown,
    fontSize: 14,
    textAlign: 'center',
  },
});
