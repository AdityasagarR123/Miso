import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import Svg, { Circle, Ellipse, Path } from 'react-native-svg';

import { KeyedVideo } from '@/components/KeyedVideo';
import { themeForCourse } from '@/components/map/mapThemes';
import { COURSES } from '@/course/courses';
import { LEVEL_PLAN } from '@/course/levels';
import type { Course } from '@/course/types';
import { useProgress } from '@/progress/ProgressContext';
import { colors, radius, spacing } from '@/theme';

const SLIDE = {
  transitionDuration: '180ms',
  transitionProperty: 'transform',
} as ViewStyle;

// CSS keyframes keep the bubbles drifting without using animation frames.
const FLOAT = {
  animationDirection: 'alternate',
  animationDuration: '2.6s',
  animationIterationCount: 'infinite',
  animationKeyframes: {
    from: { transform: 'translateY(0px)' },
    to: { transform: 'translateY(-12px)' },
  },
  animationTimingFunction: 'ease-in-out',
} as unknown as TextStyle;

function LanguageRow({ course }: { course: Course }) {
  const router = useRouter();
  const { selectCourse } = useProgress();
  const [hovered, setHovered] = useState(false);
  const theme = themeForCourse(course.id);
  const [Art] = theme.cardArt;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Learn ${course.title}`}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      onPress={() => {
        selectCourse(course.id);
        router.push('/learn');
      }}
      style={[
        styles.row,
        SLIDE,
        { transform: [{ translateX: hovered ? 10 : 0 }] },
      ]}
    >
      <View style={[styles.rowEdge, { backgroundColor: theme.accent }]} />
      <View style={styles.rowArt}>
        <Svg width="100%" height="100%" viewBox="-70 -70 140 140">
          <Art x={0} y={0} scale={0.9} />
        </Svg>
      </View>
      <View style={styles.rowText}>
        <Text style={styles.rowTitle}>{course.title}</Text>
        <Text style={styles.rowStatus}>
          {course.units.length} levels ready
        </Text>
      </View>
      <Text numberOfLines={1} style={[styles.rowGreeting, { color: theme.accent }]}>
        {course.greeting}
      </Text>
    </Pressable>
  );
}

function Stage({ height }: { height: number }) {
  return (
    <View style={[styles.stage, { height }]}>
      <View style={StyleSheet.absoluteFill}>
        <Svg width="100%" height="100%" viewBox="0 0 600 500" preserveAspectRatio="xMidYMid meet">
          <Circle cx={300} cy={235} r={210} fill="#F7B733" opacity={0.2} />
          <Circle cx={300} cy={235} r={165} fill="#F7B733" opacity={0.35} />
          <Ellipse cx={300} cy={420} rx={215} ry={30} fill="#07403B" opacity={0.75} />
          <Path d="M58 140 L72 118 M86 156 L112 146 M40 176 L66 176" stroke="#F7B733" strokeWidth={6} strokeLinecap="round" />
          <Path d="M546 110 L530 88 M520 130 L496 118 M560 148 L534 150" stroke="#F7B733" strokeWidth={6} strokeLinecap="round" />
        </Svg>
      </View>

      <View style={styles.video}>
        <KeyedVideo label="Viso the red panda studying at a desk while a butterfly flies around" />
      </View>

      <Text style={[styles.bubble, styles.bubbleOne, FLOAT]}>¡Hola!</Text>
      <Text style={[styles.bubble, styles.bubbleTwo, FLOAT, { animationDelay: '0.7s' } as TextStyle]}>
        こんにちは
      </Text>
      <Text style={[styles.bubble, styles.bubbleThree, FLOAT, { animationDelay: '1.3s' } as TextStyle]}>
        Ciao!
      </Text>
    </View>
  );
}

export function LanguagesSection({
  onLayoutY,
}: {
  onLayoutY: (y: number) => void;
}) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isWide = width >= 900;

  return (
    <View
      onLayout={(event) => onLayoutY(event.nativeEvent.layout.y)}
      style={styles.band}
    >
      <View style={[styles.inner, isWide && styles.innerWide]}>
        <View style={[styles.column, isWide && styles.columnLeft]}>
          <Text style={styles.kicker}>{LEVEL_PLAN.length} LEVELS IN EVERY LANGUAGE</Text>
          <Text
            accessibilityRole="header"
            style={[styles.title, !isWide && styles.titleSmall]}
          >
            Ten languages. One path.
          </Text>
          <Text style={styles.subtitle}>
            Viso does the homework too. Pick a language and join in.
          </Text>

          {isWide ? null : <Stage height={Math.min(width * 0.72, 330)} />}

          <View style={styles.rows}>
            {COURSES.slice(0, 5).map((course) => (
              <LanguageRow key={course.id} course={course} />
            ))}
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/languages')}
            style={styles.more}
          >
            <Text style={styles.moreText}>See all 10 languages →</Text>
          </Pressable>
        </View>

        {isWide ? (
          <View style={styles.columnRight}>
            <Stage height={560} />
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  band: {
    alignItems: 'center',
    backgroundColor: '#0B5F59',
    paddingHorizontal: spacing.md,
    paddingVertical: 64,
    width: '100%',
  },
  inner: {
    gap: spacing.lg,
    maxWidth: 1180,
    width: '100%',
  },
  innerWide: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  column: {
    gap: spacing.sm,
  },
  columnLeft: {
    flex: 5,
  },
  columnRight: {
    flex: 6,
  },
  kicker: {
    color: '#F7C948',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  title: {
    color: colors.white,
    fontSize: 40,
    fontWeight: '800',
    letterSpacing: -1,
    lineHeight: 46,
  },
  titleSmall: {
    fontSize: 36,
    lineHeight: 42,
  },
  subtitle: {
    color: '#D2F1EE',
    fontSize: 19,
    lineHeight: 28,
    marginBottom: spacing.sm,
  },
  rows: {
    gap: spacing.sm,
  },
  row: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderBottomColor: '#07403B',
    borderBottomWidth: 5,
    borderRadius: radius.md,
    flexDirection: 'row',
    gap: spacing.sm,
    minHeight: 76,
    overflow: 'hidden',
    paddingRight: spacing.md,
  },
  rowEdge: {
    alignSelf: 'stretch',
    width: 8,
  },
  rowArt: {
    height: 58,
    width: 58,
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
  rowTitle: {
    color: colors.brown,
    fontSize: 20,
    fontWeight: '800',
  },
  rowStatus: {
    color: colors.brown,
    fontSize: 14,
  },
  rowGreeting: {
    flexShrink: 0,
    fontSize: 19,
    fontWeight: '800',
  },
  more: {
    alignSelf: 'flex-start',
    justifyContent: 'center',
    marginTop: spacing.xs,
    minHeight: 44,
  },
  moreText: {
    color: '#F7C948',
    fontSize: 18,
    fontWeight: '800',
  },
  stage: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  video: {
    bottom: '4%',
    left: 0,
    position: 'absolute',
    right: 0,
    top: '4%',
  },
  bubble: {
    backgroundColor: colors.white,
    borderBottomColor: '#07403B',
    borderBottomWidth: 4,
    borderRadius: radius.md,
    color: colors.brown,
    fontSize: 20,
    fontWeight: '800',
    overflow: 'hidden',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    position: 'absolute',
  },
  bubbleOne: {
    left: '4%',
    top: '12%',
  },
  bubbleTwo: {
    right: '2%',
    top: '6%',
  },
  bubbleThree: {
    left: '2%',
    top: '60%',
  },
});
