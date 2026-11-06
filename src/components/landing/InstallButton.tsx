import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '@/theme';

const MESSAGE_MS = 2500;

export function InstallButton() {
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
        <Text style={styles.label}>Install app</Text>
      </Pressable>

      {showMessage ? (
        <View accessibilityLiveRegion="polite" style={styles.message}>
          <Text style={styles.messageText}>Coming soon</Text>
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
    backgroundColor: colors.sand,
    borderRadius: radius.pill,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: spacing.md,
  },
  pressed: {
    opacity: 0.8,
  },
  label: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '700',
  },
  message: {
    backgroundColor: colors.inkRaised,
    borderColor: colors.inkBorder,
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    position: 'absolute',
    right: 0,
    top: 52,
    width: 130,
  },
  messageText: {
    color: colors.sand,
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
});
