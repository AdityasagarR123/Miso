import { useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import { Button } from '@/components/Button';
import { GripPaw } from '@/components/landing/VisoParts';
import { OptionButton, type OptionStatus } from '@/components/OptionButton';
import { shuffle } from '@/course/shuffle';
import type { MultipleChoiceExercise } from '@/course/types';
import { colors, spacing } from '@/theme';

import type { ExerciseProps } from './types';

const LOGO_HEAD = require('../../../assets/brand/viso-head.png');

export function MultipleChoice({
  exercise,
  locked,
  onResult,
}: ExerciseProps<MultipleChoiceExercise>) {
  const [choices] = useState(() => shuffle(exercise.choices));
  const [selected, setSelected] = useState<string | null>(null);
  const { width } = useWindowDimensions();
  const headSize = width >= 700 ? 92 : 56;
  const outside = width >= 700 ? -46 : -8;

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

        <View
          pointerEvents="none"
          style={[styles.peek, { right: outside, width: headSize }]}
        >
          {/* The paw comes first, so its arm tucks in behind Viso's head. */}
          <View style={styles.peekPaw}>
            <GripPaw size={headSize * 0.36} />
          </View>
          <Image
            accessibilityLabel="Viso peeking in to watch you answer"
            source={LOGO_HEAD}
            resizeMode="contain"
            style={{ height: headSize * 0.84, width: headSize }}
          />
        </View>
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
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 36,
    textAlign: 'center',
  },
  peek: {
    position: 'absolute',
    top: 24,
    zIndex: 2,
  },
  peekPaw: {
    left: 2,
    position: 'absolute',
    top: '58%',
  },
  choices: {
    gap: spacing.sm,
  },
});
