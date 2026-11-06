import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link, usePathname } from 'expo-router';
import { useEffect, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '@/theme';

const STORAGE_KEY = 'biso.cookieNotice';

/**
 * Tells visitors what's stored. Biso only stores what it needs to work, so
 * there is nothing to accept or reject, just a notice to dismiss.
 */
export function CookieNotice() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  // A notice must never sit over the buttons of a lesson.
  const inLesson = pathname.startsWith('/lesson') || pathname.startsWith('/practice');

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((seen) => setShow(seen === null))
      .catch(() => setShow(true));
  }, []);

  if (!show || inLesson) return null;

  const dismiss = () => {
    setShow(false);
    AsyncStorage.setItem(STORAGE_KEY, 'seen').catch(() => {});
  };

  return (
    <View accessibilityRole="region" aria-label="Cookie notice" style={styles.wrap} pointerEvents="box-none">
      <View style={styles.card}>
        <Text style={styles.text}>
          Biso only stores what it needs to keep you signed in and save your progress. No ads, no
          trackers.{' '}
          <Link href="/cookies" style={styles.link}>Cookie Policy</Link>
        </Text>
        <Pressable accessibilityRole="button" onPress={dismiss} style={styles.button}>
          <Text style={styles.buttonText}>Got it</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    bottom: spacing.md,
    left: spacing.md,
    position: 'absolute',
    right: spacing.md,
    zIndex: 50,
  },
  card: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderBottomWidth: 4,
    borderColor: colors.brown,
    borderRadius: radius.md,
    borderWidth: 2,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'flex-end',
    maxWidth: 620,
    padding: spacing.sm,
    paddingHorizontal: spacing.md,
    width: '100%',
  },
  text: {
    color: colors.brown,
    flexBasis: 280,
    flexGrow: 1,
    flexShrink: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  link: {
    color: colors.tealDark,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  button: {
    alignItems: 'center',
    backgroundColor: colors.brown,
    borderRadius: radius.pill,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: spacing.md,
  },
  buttonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '800',
  },
});
