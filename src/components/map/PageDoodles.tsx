import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Svg, { Circle, G, Path } from 'react-native-svg';

import { Sparkle, Squiggle } from './Doodles';
import { PalmTree } from './MoreDoodles';

const INK = '#3B2318';

function Heart({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <G transform={`translate(${x} ${y}) rotate(-12) scale(${scale})`}>
      <Path
        d="M0 18 C-22 2 -18 -14 -8 -14 C-4 -14 -1 -11 0 -8 C1 -11 4 -14 8 -14 C18 -14 22 2 0 18 Z"
        fill="#E5533D"
        stroke={INK}
        strokeWidth={2.5}
        strokeLinejoin="round"
      />
    </G>
  );
}

function Arrow({ x, y, rotate = 0 }: { x: number; y: number; rotate?: number }) {
  return (
    <G transform={`translate(${x} ${y}) rotate(${rotate})`}>
      <Path
        d="M-28 14 C-12 4 2 -4 14 -10 L8 -18 L30 -18 L20 2 L15 -5 C4 2 -10 12 -22 22 Z"
        fill="#E8953A"
        stroke={INK}
        strokeWidth={2.5}
        strokeLinejoin="round"
      />
    </G>
  );
}

function Leaves({ x, y }: { x: number; y: number }) {
  return (
    <G transform={`translate(${x} ${y})`}>
      <Path d="M-4 30 C-30 24 -36 2 -30 -10 C-12 -4 0 10 -4 30 Z" fill="#6BAF8B" stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
      <Path d="M0 30 C-6 2 8 -24 24 -32 C38 -8 26 22 0 30 Z" fill="#E8953A" stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
    </G>
  );
}

function Flower({ x, y }: { x: number; y: number }) {
  return (
    <G transform={`translate(${x} ${y})`}>
      {[0, 72, 144, 216, 288].map((angle) => (
        <Circle
          key={angle}
          cx={0}
          cy={-11}
          r={8}
          fill="#E0662B"
          stroke={INK}
          strokeWidth={2}
          transform={`rotate(${angle})`}
        />
      ))}
      <Circle r={6} fill="#F7B733" stroke={INK} strokeWidth={2} />
    </G>
  );
}

/** Small drawings that fill the empty sides of a page on wide screens. */
export function PageDoodles({ contentWidth }: { contentWidth: number }) {
  const { width } = useWindowDimensions();
  const sideWidth = Math.min((width - contentWidth) / 2 - 8, 180);
  if (sideWidth < 90) return null;

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <View style={[styles.side, styles.left, { width: sideWidth }]}>
        <Svg width="100%" height="100%" viewBox="0 0 180 700" preserveAspectRatio="xMidYMid meet">
          <Squiggle x={80} y={90} rotate={70} />
          <Heart x={140} y={110} />
          <Sparkle x={50} y={230} scale={0.9} />
          <Sparkle x={90} y={270} scale={0.55} fill="#E5533D" />
          <Arrow x={95} y={370} />
          <Sparkle x={140} y={460} scale={0.5} />
          <Squiggle x={70} y={520} scale={0.6} rotate={-20} />
          <Leaves x={100} y={630} />
        </Svg>
      </View>

      <View style={[styles.side, styles.right, { width: sideWidth }]}>
        <Svg width="100%" height="100%" viewBox="0 0 180 700" preserveAspectRatio="xMidYMid meet">
          <Squiggle x={80} y={70} rotate={25} />
          <Sparkle x={140} y={150} fill="#E5533D" />
          <Sparkle x={70} y={230} scale={0.7} />
          <Heart x={130} y={310} scale={0.9} />
          <Flower x={60} y={400} />
          <Arrow x={100} y={500} rotate={180} />
          <PalmTree x={90} y={625} scale={0.95} />
        </Svg>
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
