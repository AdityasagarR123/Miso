import { useEffect, useState } from 'react';
import {
  AccessibilityInfo,
  Platform,
  StyleSheet,
  type ViewStyle,
} from 'react-native';

type MotionKind = 'nod' | 'bob' | 'sway' | 'float';

// CSS keyframes keep Biso moving without using animation frames, so this stays
// light and never competes with a hover effect on a parent element. The web
// build only turns keyframes into real animations inside StyleSheet.create.
const MOTIONS = StyleSheet.create<Record<MotionKind, ViewStyle>>({
  nod: {
    animationDirection: 'alternate',
    animationDuration: '1.1s',
    animationIterationCount: 'infinite',
    animationKeyframes: {
      from: { transform: 'translateY(0px) rotate(-5deg)' },
      to: { transform: 'translateY(-5px) rotate(6deg)' },
    },
    animationTimingFunction: 'ease-in-out',
  } as unknown as ViewStyle,
  bob: {
    animationDirection: 'alternate',
    animationDuration: '1.5s',
    animationIterationCount: 'infinite',
    animationKeyframes: {
      from: { transform: 'translateY(0px)' },
      to: { transform: 'translateY(-7px)' },
    },
    animationTimingFunction: 'ease-in-out',
  } as unknown as ViewStyle,
  float: {
    animationDirection: 'alternate',
    animationDuration: '2.6s',
    animationIterationCount: 'infinite',
    animationKeyframes: {
      from: { transform: 'translateY(0px)' },
      to: { transform: 'translateY(-12px)' },
    },
    animationTimingFunction: 'ease-in-out',
  } as unknown as ViewStyle,
  sway: {
    animationDirection: 'alternate',
    animationDuration: '1.8s',
    animationIterationCount: 'infinite',
    animationKeyframes: {
      from: { transform: 'rotate(-2.5deg)' },
      to: { transform: 'rotate(2.5deg)' },
    },
    animationTimingFunction: 'ease-in-out',
  } as unknown as ViewStyle,
});

/** A style that keeps Biso gently moving, unless reduced motion is on. */
export function useGentleMotion(kind: MotionKind): ViewStyle | undefined {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduced);
    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setReduced,
    );
    return () => subscription.remove();
  }, []);

  return Platform.OS === 'web' && !reduced ? MOTIONS[kind] : undefined;
}
