import { useEffect, useState } from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  type ViewStyle,
} from 'react-native';

import { celebrate } from '@/components/Confetti';
import { useGentleMotion } from '@/components/gentleMotion';
import { colors, radius, spacing } from '@/theme';

import { DanglingLegs } from './VisoParts';

const LOGO_FULL = require('../../../assets/brand/viso-full.png');

// A CSS transition makes Viso's hop smooth on the web.
const HOP = {
  transitionDuration: '220ms',
  transitionProperty: 'transform',
} as ViewStyle;

const WORDS = [
  { language: 'Spanish', word: 'gracias' },
  { language: 'French', word: 'merci' },
  { language: 'German', word: 'danke' },
  { language: 'Japanese', word: 'ありがとう' },
  { language: 'Korean', word: '감사합니다' },
];

const CHOICES = ['Goodbye', 'Thank you', 'Please'];
const ANSWER = 'Thank you';

export function TryIt() {
  const [wordIndex, setWordIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [cheering, setCheering] = useState(false);
  const sway = useGentleMotion('sway');
  const { width } = useWindowDimensions();
  const visoWidth = width >= 800 ? 170 : 120;
  // The art is cropped above Viso's feet, where the drawn legs take over.
  const visoHeight = visoWidth * (690 / 732) * 0.88;

  useEffect(() => {
    if (!cheering) return;
    const timer = setTimeout(() => setCheering(false), 500);
    return () => clearTimeout(timer);
  }, [cheering]);

  const { language, word } = WORDS[wordIndex];

  return (
    <View style={{ paddingTop: visoHeight - 14 }}>
    <View style={styles.card}>
      <View style={styles.languages}>
        {WORDS.map((item, index) => (
          <Pressable
            key={item.language}
            accessibilityRole="button"
            accessibilityState={{ selected: index === wordIndex }}
            onPress={() => {
              setWordIndex(index);
              setPicked(null);
            }}
            style={[styles.chip, index === wordIndex && styles.chipActive]}
          >
            <Text
              style={[
                styles.chipText,
                index === wordIndex && styles.chipTextActive,
              ]}
            >
              {item.language}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.question}>What does "{word}" mean?</Text>

      <View style={styles.choices}>
        {CHOICES.map((choice) => {
          const chosen = picked === choice;
          const right = chosen && choice === ANSWER;
          const wrong = chosen && choice !== ANSWER;

          return (
            <Pressable
              key={choice}
              accessibilityRole="button"
              accessibilityState={{ selected: chosen }}
              onPress={() => {
                setPicked(choice);
                if (choice === ANSWER) {
                  celebrate();
                  setCheering(true);
                }
              }}
              style={({ pressed }) => [
                styles.choice,
                right && styles.choiceRight,
                wrong && styles.choiceWrong,
                pressed && styles.choicePressed,
              ]}
            >
              <Text style={styles.choiceText}>{choice}</Text>
            </Pressable>
          );
        })}
      </View>

      <Text accessibilityLiveRegion="polite" style={styles.feedback}>
        {picked === null
          ? `Tap an answer to try a tiny ${language} lesson.`
          : picked === ANSWER
            ? 'Correct! That is your first word.'
            : 'Not quite. Viso believes in you, so try again.'}
      </Text>
    </View>

      <View
        pointerEvents="none"
        style={[
          styles.sitting,
          HOP,
          { transform: [{ translateY: cheering ? -22 : 0 }], width: visoWidth },
        ]}
      >
        <View style={sway}>
        <View style={[styles.visoCrop, { height: visoHeight }]}>
          <Image
            accessibilityLabel="Viso the red panda, sitting on the card"
            source={LOGO_FULL}
            resizeMode="contain"
            style={{ height: visoWidth * (690 / 732), width: visoWidth }}
          />
        </View>
        </View>
        <View style={styles.legs}>
          <DanglingLegs width={visoWidth * 0.42} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sitting: {
    position: 'absolute',
    right: '6%',
    top: 0,
  },
  visoCrop: {
    overflow: 'hidden',
  },
  legs: {
    alignSelf: 'center',
    marginLeft: 10,
    marginTop: -6,
  },
  card: {
    backgroundColor: colors.white,
    borderBottomWidth: 8,
    borderColor: colors.brown,
    borderRadius: radius.lg,
    borderWidth: 3,
    gap: spacing.md,
    padding: spacing.lg,
  },
  languages: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  chip: {
    borderColor: colors.brown,
    borderRadius: radius.pill,
    borderWidth: 2,
    justifyContent: 'center',
    minHeight: 38,
    paddingHorizontal: spacing.md,
  },
  chipActive: {
    backgroundColor: colors.brown,
  },
  chipText: {
    color: colors.brown,
    fontSize: 14,
    fontWeight: '700',
  },
  chipTextActive: {
    color: colors.white,
  },
  question: {
    color: colors.brown,
    fontSize: 28,
    fontWeight: '800',
  },
  choices: {
    gap: spacing.sm,
  },
  choice: {
    alignItems: 'center',
    backgroundColor: colors.cream,
    borderBottomWidth: 6,
    borderColor: colors.brown,
    borderRadius: radius.md,
    borderWidth: 2,
    justifyContent: 'center',
    minHeight: 54,
    padding: spacing.sm,
  },
  choicePressed: {
    borderBottomWidth: 2,
    marginTop: 4,
  },
  choiceRight: {
    backgroundColor: colors.tealLight,
  },
  choiceWrong: {
    backgroundColor: colors.rustLight,
  },
  choiceText: {
    color: colors.brown,
    fontSize: 17,
    fontWeight: '800',
  },
  feedback: {
    color: colors.brown,
    fontSize: 15,
    lineHeight: 22,
  },
});
