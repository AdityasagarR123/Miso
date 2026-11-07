import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { characterForLevel } from '@/components/characters';
import { useGentleMotion } from '@/components/gentleMotion';
import { useSpeech } from '@/components/useSpeech';
import type { TeachExercise } from '@/course/types';
import { colors, radius, spacing } from '@/theme';

type TeachStepProps = {
  exercise: TeachExercise;
  levelId: string;
  languageTitle: string;
  languageCode: string;
  onDone: () => void;
};

/** A character introduces each new word, so learners never have to guess. */
export function TeachStep({
  exercise,
  levelId,
  languageTitle,
  languageCode,
  onDone,
}: TeachStepProps) {
  const character = characterForLevel(levelId);
  const speak = useSpeech(languageCode);
  const bob = useGentleMotion('bob');
  // Page -1 is the character's hello. Then one page for each word.
  const [page, setPage] = useState(-1);
  const item = page >= 0 ? exercise.items[page] : null;
  const isLast = page === exercise.items.length - 1;

  return (
    <View style={styles.container}>
      <View accessibilityLiveRegion="polite" style={styles.bubble}>
        <Text style={styles.speaker}>{character.name}</Text>
        {item ? (
          <>
            <Text style={styles.line}>
              In {languageTitle}, "{item.english}" is:
            </Text>
            <Text {...({ lang: languageCode } as object)} style={styles.target}>
              {item.target}
            </Text>
            {item.say ? <Text style={styles.say}>Say it like: {item.say}</Text> : null}
            {speak ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Listen to ${item.target}`}
                onPress={() => speak(item.target)}
                style={({ pressed }) => [styles.listen, pressed && styles.pressed]}
              >
                <Text style={styles.listenText}>▶ Listen</Text>
              </Pressable>
            ) : null}
          </>
        ) : (
          <Text style={styles.line}>{character.intro}</Text>
        )}
        <View style={styles.tail} />
      </View>

      <View style={bob}>
        <Image
          accessibilityLabel={`${character.name}, your teacher for this level`}
          source={character.image}
          resizeMode="contain"
          style={{ height: 200, width: 200 * character.aspectRatio }}
        />
      </View>

      {page >= 0 ? (
        <View accessibilityLabel={`Word ${page + 1} of ${exercise.items.length}`} style={styles.dots}>
          {exercise.items.map((word, dot) => (
            <View key={word.english} style={[styles.dot, dot <= page && styles.dotDone]} />
          ))}
        </View>
      ) : null}

      <Button
        label={page < 0 ? "Let's learn!" : isLast ? "I'm ready to practice!" : 'Next word'}
        onPress={() => (isLast ? onDone() : setPage(page + 1))}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: spacing.md,
  },
  bubble: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderBottomWidth: 6,
    borderColor: colors.brown,
    borderRadius: radius.lg,
    borderWidth: 2,
    gap: spacing.sm,
    minHeight: 150,
    justifyContent: 'center',
    padding: spacing.lg,
    width: '100%',
  },
  tail: {
    backgroundColor: colors.white,
    borderBottomWidth: 2,
    borderColor: colors.brown,
    borderRightWidth: 2,
    bottom: -12,
    height: 18,
    position: 'absolute',
    transform: [{ rotate: '45deg' }],
    width: 18,
  },
  speaker: {
    color: colors.rustDark,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  line: {
    color: colors.brown,
    fontSize: 19,
    lineHeight: 27,
    textAlign: 'center',
  },
  target: {
    color: colors.tealDark,
    fontSize: 36,
    fontWeight: '800',
    lineHeight: 46,
    textAlign: 'center',
  },
  say: {
    color: colors.brown,
    fontSize: 16,
    textAlign: 'center',
  },
  listen: {
    alignItems: 'center',
    backgroundColor: colors.tealLight,
    borderRadius: radius.pill,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: spacing.md,
  },
  pressed: {
    opacity: 0.8,
  },
  listenText: {
    color: colors.tealDark,
    fontSize: 16,
    fontWeight: '800',
  },
  dots: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  dot: {
    backgroundColor: colors.border,
    borderRadius: radius.pill,
    height: 10,
    width: 10,
  },
  dotDone: {
    backgroundColor: colors.teal,
  },
});
