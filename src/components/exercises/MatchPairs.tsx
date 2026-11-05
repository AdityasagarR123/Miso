import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { OptionButton, type OptionStatus } from '@/components/OptionButton';
import { shuffle } from '@/course/shuffle';
import type { MatchPairsExercise } from '@/course/types';
import { colors, spacing } from '@/theme';

import type { ExerciseProps } from './types';

type Side = 'left' | 'right';
type Tile = { side: Side; pairIndex: number };

export function MatchPairs({
  exercise,
  locked,
  onResult,
}: ExerciseProps<MatchPairsExercise>) {
  const [order] = useState(() => {
    const indexes = exercise.pairs.map((_, index) => index);
    return { left: shuffle(indexes), right: shuffle(indexes) };
  });
  const [selected, setSelected] = useState<Tile | null>(null);
  const [wrong, setWrong] = useState<Tile[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [mistakes, setMistakes] = useState(0);

  const press = (tile: Tile) => {
    setWrong([]);

    if (!selected || selected.side === tile.side) {
      setSelected(tile);
      return;
    }

    setSelected(null);

    if (selected.pairIndex !== tile.pairIndex) {
      setWrong([selected, tile]);
      setMistakes(mistakes + 1);
      return;
    }

    const nowMatched = [...matched, tile.pairIndex];
    setMatched(nowMatched);

    if (nowMatched.length === exercise.pairs.length) {
      onResult({
        correct: mistakes === 0,
        detail:
          mistakes === 0
            ? undefined
            : `All matched, with ${mistakes} ${mistakes === 1 ? 'mistake' : 'mistakes'}.`,
      });
    }
  };

  const statusFor = (tile: Tile): OptionStatus => {
    if (matched.includes(tile.pairIndex)) return 'correct';
    if (wrong.some((w) => w.side === tile.side && w.pairIndex === tile.pairIndex)) {
      return 'wrong';
    }
    return selected?.side === tile.side && selected.pairIndex === tile.pairIndex
      ? 'selected'
      : 'idle';
  };

  const renderColumn = (side: Side) => (
    <View style={styles.column}>
      {order[side].map((pairIndex) => (
        <OptionButton
          key={pairIndex}
          label={exercise.pairs[pairIndex][side]}
          status={statusFor({ side, pairIndex })}
          disabled={locked || matched.includes(pairIndex)}
          onPress={() => press({ side, pairIndex })}
        />
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.prompt}>{exercise.prompt}</Text>
      <View style={styles.columns}>
        {renderColumn('left')}
        {renderColumn('right')}
      </View>
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
  columns: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  column: {
    flex: 1,
    gap: spacing.sm,
  },
});
