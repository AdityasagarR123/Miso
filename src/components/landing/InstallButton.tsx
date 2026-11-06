import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '@/theme';

const MESSAGE_MS = 2500;

export function InstallButton({ short = false }: { short?: boolean }) {
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (!showMessage) return;
    const timer = setTimeout(() => setShowMessage(false), MESSAGE_MS);
    return () => clearTimeout(timer);
  }, [showMessage]);

  return (
    <View style={styles.wrapper}>
      <Pressable
        accessibilityRole="button"
        onPress={() => setShowMessage(true)}
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      >
        <Text style={styles.label}>{short ? 'Install' : 'Install app'}</Text>
      </Pressable>

      {showMessage ? (
        <View accessibilityLiveRegion="polite" style={styles.message}>
          <Text style={styles.messageTitle}>Coming soon!</Text>
          <Text style={styles.messageText}>
            The Biso app is on its way. For now, learn right here.
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    zIndex: 20,
  },
  button: {
    alignItems: 'center',
    backgroundColor: colors.rustLight,
    borderRadius: radius.pill,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: 14,
  },
  pressed: {
    opacity: 0.8,
  },
  label: {
    color: colors.rustDark,
    fontSize: 15,
    fontWeight: '800',
  },
  message: {
    backgroundColor: colors.white,
    borderColor: colors.rust,
    borderRadius: radius.md,
    borderWidth: 2,
    gap: spacing.xs,
    padding: spacing.md,
    position: 'absolute',
    right: -100,
    top: 52,
    width: 220,
  },
  messageTitle: {
    color: colors.rustDark,
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },
  messageText: {
    color: colors.brown,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
});
