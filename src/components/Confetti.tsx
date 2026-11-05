import { useEffect, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Easing,
  Platform,
  StyleSheet,
  useWindowDimensions,
  View,
  type ViewStyle,
} from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

const DURATION_MS = 1700;
const PIECES_PER_SIDE = 34;
const COLORS = ['#E5533D', '#F7B733', '#14A89D', '#F07B3F', '#8E7CB8', '#7CB65C', '#F08CAB'];

// Any screen can fire the poppers, and the one host at the top of the app draws
// them, so nothing else on the page can ever paint over them.
const listeners = new Set<() => void>();

export function celebrate() {
  for (const listener of listeners) listener();
}

type Piece = {
  side: 1 | -1;
  endX: number;
  peak: number;
  fall: number;
  spin: number;
  color: string;
  width: number;
  height: number;
  round: boolean;
};

function makePieces(width: number, height: number): Piece[] {
  const random = (min: number, max: number) => min + Math.random() * (max - min);

  return Array.from({ length: PIECES_PER_SIDE * 2 }, (_, index) => {
    const side = index % 2 === 0 ? 1 : -1;
    return {
      side,
      endX: side * random(width * 0.08, width * 0.62),
      peak: random(height * 0.3, height * 0.85),
      fall: random(height * 0.1, height * 0.4),
      spin: random(360, 1080) * (Math.random() > 0.5 ? 1 : -1),
      color: COLORS[index % COLORS.length],
      width: random(7, 12),
      height: random(10, 18),
      round: index % 5 === 0,
    };
  });
}

function PartyPopper({ flip }: { flip: boolean }) {
  return (
    <View style={flip ? styles.flipped : undefined}>
      <Svg width={84} height={84} viewBox="0 0 64 64">
        <Path
          d="M6 58 L20 18 L46 44 Z"
          fill="#F7B733"
          stroke="#3B2318"
          strokeWidth={3}
          strokeLinejoin="round"
        />
        <Path d="M13 38 L27 52 M17 27 L38 47" stroke="#E5533D" strokeWidth={5} />
        <Path
          d="M20 18 C26 14 42 28 46 44 C40 44 24 30 20 18 Z"
          fill="#FFF4E3"
          stroke="#3B2318"
          strokeWidth={3}
          strokeLinejoin="round"
        />
        <Circle cx={42} cy={16} r={3.5} fill="#14A89D" />
        <Circle cx={54} cy={28} r={3} fill="#E5533D" />
        <Path d="M32 8 L34 2 M50 12 L56 7 M58 38 L63 36" stroke="#3B2318" strokeWidth={3} strokeLinecap="round" />
      </Svg>
    </View>
  );
}

function Burst({ onDone }: { onDone: () => void }) {
  const { width, height } = useWindowDimensions();
  const progress = useRef(new Animated.Value(0)).current;
  const [pieces] = useState(() => makePieces(width, height));

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: DURATION_MS,
      easing: Easing.out(Easing.quad),
      useNativeDriver: Platform.OS !== 'web',
    }).start();
    // A timer, not the animation's callback, so it always cleans up even if the
    // browser pauses animation frames in a background tab.
    const timer = setTimeout(onDone, DURATION_MS + 100);
    return () => clearTimeout(timer);
  }, [onDone, progress]);

  const popperScale = progress.interpolate({
    inputRange: [0, 0.08, 0.2, 0.8, 1],
    outputRange: [0.4, 1.2, 1, 1, 0],
  });

  return (
    <View pointerEvents="none" style={styles.overlay}>
      {pieces.map((piece, index) => (
        <Animated.View
          key={index}
          style={[
            styles.piece,
            piece.side === 1 ? styles.fromLeft : styles.fromRight,
            {
              backgroundColor: piece.color,
              borderRadius: piece.round ? piece.width : 2,
              height: piece.round ? piece.width : piece.height,
              opacity: progress.interpolate({
                inputRange: [0, 0.03, 0.75, 1],
                outputRange: [0, 1, 1, 0],
              }),
              transform: [
                {
                  translateX: progress.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0, piece.endX * 0.8, piece.endX],
                  }),
                },
                {
                  translateY: progress.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0, -piece.peak, -piece.peak + piece.fall],
                  }),
                },
                {
                  rotate: progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', `${piece.spin}deg`],
                  }),
                },
              ],
              width: piece.width,
            },
          ]}
        />
      ))}

      <Animated.View
        style={[styles.popper, styles.popperLeft, { transform: [{ scale: popperScale }] }]}
      >
        <PartyPopper flip={false} />
      </Animated.View>
      <Animated.View
        style={[styles.popper, styles.popperRight, { transform: [{ scale: popperScale }] }]}
      >
        <PartyPopper flip />
      </Animated.View>
    </View>
  );
}

/** Mount once, last, at the root of the app. */
export function ConfettiHost() {
  const [burst, setBurst] = useState(0);
  const [active, setActive] = useState(false);
  const [reduced, setReduced] = useState(false);
  const clear = useRef(() => setActive(false)).current;

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduced);
    const listener = () => {
      setBurst((current) => current + 1);
      setActive(true);
    };
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  if (!active || reduced) return null;
  return <Burst key={burst} onDone={clear} />;
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
    zIndex: 1000,
    ...(Platform.OS === 'web' ? ({ position: 'fixed' } as unknown as ViewStyle) : {}),
  },
  piece: {
    bottom: 40,
    position: 'absolute',
  },
  fromLeft: {
    left: 50,
  },
  fromRight: {
    right: 50,
  },
  popper: {
    bottom: 8,
    position: 'absolute',
  },
  popperLeft: {
    left: 8,
  },
  popperRight: {
    right: 8,
  },
  flipped: {
    transform: [{ scaleX: -1 }],
  },
});
