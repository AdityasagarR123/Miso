import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useInstall } from '@/lib/install';
import { colors, radius, spacing } from '@/theme';

type InstallButtonProps = {
  /** Where the help panel opens, relative to the button. */
  helpPosition?: 'below-right' | 'below-center';
};

export function InstallButton({
  helpPosition = 'below-right',
}: InstallButtonProps) {
  const { canPrompt, isInstalled, prompt } = useInstall();
  const [showHelp, setShowHelp] = useState(false);

  if (isInstalled) return null;

  return (
    <View style={styles.wrapper}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Install Viso on this device"
        accessibilityState={{ expanded: showHelp }}
        onPress={() => {
          if (canPrompt) {
            setShowHelp(false);
            prompt();
          } else {
            setShowHelp(!showHelp);
          }
        }}
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      >
        <Text style={styles.icon}>↓</Text>
        <Text style={styles.label}>Install app</Text>
      </Pressable>

      {showHelp ? (
        <View
          accessibilityLiveRegion="polite"
          style={[
            styles.help,
            helpPosition === 'below-right' ? styles.helpRight : styles.helpCenter,
          ]}
        >
          <Text style={styles.helpTitle}>Add Viso to your device</Text>
          <Text style={styles.helpText}>
            Chrome or Edge on a computer: use the install icon in the address
            bar, or find "Install Viso" in the browser menu.
          </Text>
          <Text style={styles.helpText}>
            Safari on a Mac: choose File, then Add to Dock.
          </Text>
          <Text style={styles.helpText}>
            iPhone or Android: open the browser's share or menu button, then
            choose Add to Home Screen.
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
    backgroundColor: colors.sand,
    borderRadius: radius.pill,
    flexDirection: 'row',
    gap: spacing.xs,
    minHeight: 44,
    paddingHorizontal: spacing.md,
  },
  pressed: {
    opacity: 0.8,
  },
  icon: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: '800',
  },
  label: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '700',
  },
  help: {
    backgroundColor: colors.inkRaised,
    borderColor: colors.inkBorder,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.md,
    position: 'absolute',
    top: 52,
    width: 290,
  },
  helpRight: {
    right: 0,
  },
  helpCenter: {
    alignSelf: 'center',
  },
  helpTitle: {
    color: colors.sand,
    fontSize: 16,
    fontWeight: '800',
  },
  helpText: {
    color: colors.sandMuted,
    fontSize: 14,
    lineHeight: 20,
  },
});
