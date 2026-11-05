import { StyleSheet, View } from 'react-native';
import Svg, { G, Path, Text as SvgText } from 'react-native-svg';

import {
  Bamboo,
  Cloud,
  Lantern,
  Mountain,
  Sparkle,
  Squiggle,
} from '@/components/map/Doodles';

const LINE = '#FBF0E0';
const FONT = 'system-ui, -apple-system, "Segoe UI", sans-serif';

function Bubble({
  x,
  y,
  text,
  fill,
  rotate = 0,
}: {
  x: number;
  y: number;
  text: string;
  fill: string;
  rotate?: number;
}) {
  // Japanese and Korean characters are about twice as wide as Latin letters.
  const units = [...text].reduce(
    (sum, char) => sum + (char.charCodeAt(0) > 0x2e80 ? 30 : 17),
    0,
  );
  const width = Math.max(units + 48, 110);

  return (
    <G transform={`translate(${x} ${y}) rotate(${rotate})`}>
      <Path
        d={`M${-width / 2 + 22} -30 H${width / 2 - 22} a22 22 0 0 1 22 22 V8 a22 22 0 0 1 -22 22 H-8 L-26 48 L-24 30 H${-width / 2 + 22} a22 22 0 0 1 -22 -22 V-8 a22 22 0 0 1 22 -22 Z`}
        fill={fill}
        stroke="#3B2318"
        strokeWidth={3}
        strokeLinejoin="round"
      />
      <SvgText
        x={0}
        y={10}
        fontFamily={FONT}
        fontSize={28}
        fontWeight="800"
        textAnchor="middle"
        fill="#3B2318"
      >
        {text}
      </SvgText>
    </G>
  );
}

/** Decorative art that fills the empty space on each side of the hero. */
export function HeroArt({ width }: { width: number }) {
  // How wide each side panel can be without running under the headline.
  const sideWidth = Math.min(Math.max((width - 860) / 2, 0), 340);
  if (sideWidth < 150) return null;

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <View style={[styles.side, styles.left, { width: sideWidth }]}>
        <Svg width="100%" height="100%" viewBox="0 0 340 720" preserveAspectRatio="xMinYMid meet">
          <Cloud x={120} y={90} line={LINE} />
          <Sparkle x={250} y={70} line="#3B2318" />
          <Bubble x={170} y={210} text="Hello!" fill="#F7B733" rotate={-6} />
          <Squiggle x={90} y={320} line={LINE} rotate={20} />
          <Bubble x={190} y={410} text="Bonjour" fill="#9FD8D2" rotate={5} />
          <Sparkle x={290} y={330} line="#3B2318" fill="#E5533D" scale={0.7} />
          <Bamboo x={90} y={700} scale={1.25} line="#3B2318" />
          <Lantern x={245} y={585} scale={1.05} line="#3B2318" />
        </Svg>
      </View>

      <View style={[styles.side, styles.right, { width: sideWidth }]}>
        <Svg width="100%" height="100%" viewBox="0 0 340 720" preserveAspectRatio="xMaxYMid meet">
          <Cloud x={230} y={100} line={LINE} scale={1.1} />
          <Sparkle x={80} y={70} line="#3B2318" fill="#9FD8D2" />
          <Bubble x={170} y={220} text="こんにちは" fill="#F7B733" rotate={6} />
          <Squiggle x={250} y={325} line={LINE} rotate={160} />
          <Bubble x={150} y={420} text="안녕하세요" fill="#FBE0D3" rotate={-5} />
          <Sparkle x={290} y={470} line="#3B2318" scale={0.8} />
          <Mountain x={190} y={650} scale={1.5} line="#3B2318" />
          <Sparkle x={60} y={540} line="#3B2318" fill="#E5533D" scale={0.7} />
        </Svg>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  side: {
    bottom: 40,
    position: 'absolute',
    top: 90,
  },
  left: {
    left: 16,
  },
  right: {
    right: 16,
  },
});
