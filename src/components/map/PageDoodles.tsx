import type { ComponentType } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Svg from 'react-native-svg';

import { useProgress } from '@/progress/ProgressContext';

import type { DoodleProps } from './Doodles';
import { Sparkle } from './Doodles';
import { LatticeTower, Torii } from './LanguageDoodles';
import { themeForCourse } from './mapThemes';
import { DomePalace, LeaningTower, Pagoda, PalmTree } from './MoreDoodles';

type Art = ComponentType<DoodleProps>;

// One landmark from where each kind of language comes from, not random shapes.
const WORLD_LEFT: Art[] = [LatticeTower, Torii, DomePalace];
const WORLD_RIGHT: Art[] = [LeaningTower, Pagoda, PalmTree];

function Column({ art }: { art: Art[] }) {
  return (
    <Svg width="100%" height="100%" viewBox="0 0 180 640" preserveAspectRatio="xMidYMid meet">
      {art.map((Drawing, index) => (
        <Drawing key={index} x={90} y={110 + index * 210} scale={0.9} />
      ))}
      <Sparkle x={150} y={215} scale={0.5} />
      <Sparkle x={32} y={425} scale={0.5} fill="#E5533D" />
    </Svg>
  );
}

/**
 * Fills the empty sides of a page on wide screens. In a lesson it shows art from
 * that language's world; on the language picker it shows a few world landmarks.
 */
export function PageDoodles({
  contentWidth,
  world = false,
}: {
  contentWidth: number;
  world?: boolean;
}) {
  const { width } = useWindowDimensions();
  const { course } = useProgress();
  const sideWidth = Math.min((width - contentWidth) / 2 - 8, 180);
  if (sideWidth < 90) return null;

  const theme = course && !world ? themeForCourse(course.id) : null;
  const [first, second, third, fourth] = theme?.doodles ?? [];
  const left = theme ? [first, second] : WORLD_LEFT;
  const right = theme ? [third, fourth] : WORLD_RIGHT;

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <View style={[styles.side, styles.left, { width: sideWidth }]}>
        <Column art={left} />
      </View>
      <View style={[styles.side, styles.right, { width: sideWidth }]}>
        <Column art={right} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  side: {
    bottom: 8,
    position: 'absolute',
    top: 8,
  },
  left: {
    left: 4,
  },
  right: {
    right: 4,
  },
});
