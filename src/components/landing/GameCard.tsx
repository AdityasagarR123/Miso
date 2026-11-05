import { useState, type ComponentType } from 'react';
import { Image, Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';

import { useGentleMotion } from '@/components/gentleMotion';
import { colors, radius, spacing } from '@/theme';

import { GripPaw, Tail } from './VisoParts';

const LOGO_HEAD = require('../../../assets/brand/viso-head.png');

export type CardPose = 'hug' | 'peek-center' | 'peek-left' | 'peek-right';

type GameCardProps = {
  Icon: ComponentType<{ size?: number }>;
  title: string;
  text: string;
  color: string;
  tilt: string;
  pose: CardPose;
  hoverLine: string;
};

const HEAD_WIDTH = 96;
const HEAD_HEIGHT = 80;
// How far the card sits below the top, so that Viso's chin hides behind it.
const CARD_TOP = 52;

// CSS transitions make hovering smooth on the web and do nothing on phones.
const SMOOTH = {
  transitionDuration: '180ms',
  transitionProperty: 'transform',
} as ViewStyle;

const HEAD_POSITION: Record<CardPose, ViewStyle> = {
  hug: { alignSelf: 'center' },
  'peek-center': { alignSelf: 'center' },
  'peek-left': { left: 18 },
  'peek-right': { right: 18 },
};

export function GameCard({
  Icon,
  title,
  text,
  color,
  tilt,
  pose,
  hoverLine,
}: GameCardProps) {
  const [hovered, setHovered] = useState(false);
  const bob = useGentleMotion('bob');
  const headLean = pose === 'peek-right' ? '-8deg' : '8deg';

  return (
    <Pressable
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      onPressIn={() => setHovered(true)}
      onPressOut={() => setHovered(false)}
      style={[
        styles.wrap,
        SMOOTH,
        {
          transform: hovered
            ? [{ translateY: -8 }, { rotate: '0deg' }, { scale: 1.03 }]
            : [{ translateY: 0 }, { rotate: tilt }, { scale: 1 }],
        },
      ]}
    >
      {pose === 'peek-left' || pose === 'hug' ? (
        <View pointerEvents="none" style={[styles.tail, SMOOTH, hovered && styles.tailWag]}>
          <Tail size={84} />
        </View>
      ) : null}

      {/* Viso sits behind the card, so the card hides the chin. */}
      <View
        pointerEvents="none"
        style={[
          styles.head,
          HEAD_POSITION[pose],
          SMOOTH,
          {
            transform: hovered
              ? [{ translateY: -16 }, { rotate: headLean }]
              : [{ translateY: 0 }, { rotate: '0deg' }],
          },
        ]}
      >
        <View style={[styles.headImage, bob]}>
          <Image
            accessibilityLabel="Viso peeking over the card"
            source={LOGO_HEAD}
            resizeMode="contain"
            style={styles.headImage}
          />
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: color }]}>
        <Icon size={64} />
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.text}>{hovered ? hoverLine : text}</Text>
      </View>

      {/* The paws sit in front of the card, so Viso looks like it's holding on. */}
      {pose === 'hug' ? (
        <>
          <View pointerEvents="none" style={[styles.paw, styles.hugLeft]}>
            <GripPaw size={42} />
          </View>
          <View pointerEvents="none" style={[styles.paw, styles.hugRight]}>
            <GripPaw size={42} />
          </View>
        </>
      ) : (
        <>
          <View pointerEvents="none" style={[styles.paw, pawPosition(pose, 0)]}>
            <GripPaw size={36} />
          </View>
          <View pointerEvents="none" style={[styles.paw, pawPosition(pose, 1)]}>
            <GripPaw size={36} />
          </View>
        </>
      )}
    </Pressable>
  );
}

function pawPosition(pose: CardPose, index: number): ViewStyle {
  const top = CARD_TOP - 18;
  if (pose === 'peek-left') return { left: 12 + index * 72, top };
  if (pose === 'peek-right') return { right: 12 + index * 72, top };
  return { left: index === 0 ? '26%' : '60%', top };
}

const styles = StyleSheet.create({
  wrap: {
    flexBasis: 220,
    flexGrow: 1,
    maxWidth: 480,
    paddingTop: CARD_TOP,
  },
  tail: {
    bottom: 6,
    position: 'absolute',
    right: -30,
  },
  tailWag: {
    transform: [{ rotate: '14deg' }],
  },
  head: {
    height: HEAD_HEIGHT,
    position: 'absolute',
    top: 0,
    width: HEAD_WIDTH,
  },
  headImage: {
    height: '100%',
    width: '100%',
  },
  card: {
    borderBottomWidth: 8,
    borderColor: colors.brown,
    borderRadius: radius.lg,
    borderWidth: 3,
    flexGrow: 1,
    gap: spacing.sm,
    minHeight: 200,
    padding: spacing.lg,
    paddingTop: spacing.lg + 8,
  },
  title: {
    color: colors.brown,
    fontSize: 22,
    fontWeight: '800',
  },
  text: {
    color: colors.brown,
    fontSize: 15,
    lineHeight: 22,
  },
  paw: {
    position: 'absolute',
  },
  hugLeft: {
    left: -14,
    top: CARD_TOP + 62,
    transform: [{ rotate: '-82deg' }],
  },
  hugRight: {
    right: -14,
    top: CARD_TOP + 62,
    transform: [{ rotate: '82deg' }],
  },
});
