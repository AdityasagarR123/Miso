import { useEffect } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { celebrate } from '@/components/Confetti';
import { useGentleMotion } from '@/components/gentleMotion';
import { colors, radius, spacing } from '@/theme';

const LOGO_HEAD = require('../../assets/brand/biso-head.png');

/** Biso's face pops up to congratulate the learner, with party poppers. */
export function Congrats({ title, message }: { title: string; message: string }) {
  const cheer = useGentleMotion('cheer');

  useEffect(() => {
    celebrate();
  }, []);

  return (
    <View accessibilityLiveRegion="polite" style={styles.card}>
      <View style={styles.bubble}>
        <Text accessibilityRole="header" style={styles.title}>
          {title}
        </Text>
        <Text style={styles.message}>{message}</Text>
        <View style={styles.tail} />
      </View>
      <View style={cheer}>
        <Image
          accessibilityLabel="Biso the red panda, cheering"
          source={LOGO_HEAD}
          resizeMode="contain"
          style={styles.face}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
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
    gap: spacing.xs,
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
  title: {
    color: colors.brown,
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
  },
  message: {
    color: colors.brown,
    fontSize: 17,
    lineHeight: 24,
    textAlign: 'center',
  },
  face: {
    height: 150,
    width: 180,
  },
});
