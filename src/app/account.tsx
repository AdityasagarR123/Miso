import { Redirect, Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@/auth/AuthContext';
import { friendlyAuthError } from '@/auth/authHelpers';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { useProgress } from '@/progress/ProgressContext';
import { colors, radius, spacing } from '@/theme';

export default function AccountScreen() {
  const router = useRouter();
  const { user, loading, signOut, deleteAccount } = useAuth();
  const { resetProgress } = useProgress();
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [confirmingErase, setConfirmingErase] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [deleted, setDeleted] = useState(false);

  if (loading) return <Screen>{null}</Screen>;
  if (deleted) return <Redirect href="/" />;
  if (!user) {
    return <Redirect href={{ pathname: '/sign-in', params: { mode: 'sign-in', next: '/account' } }} />;
  }

  const removeAccount = async () => {
    setBusy(true);
    setError(null);
    try {
      await deleteAccount();
      resetProgress();
      setDeleted(true);
    } catch (caught) {
      setError(friendlyAuthError(caught));
      setConfirmingDelete(false);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen>
      <Stack.Screen options={{ title: 'Account' }} />
      <Text accessibilityRole="header" style={styles.title}>Your account</Text>
      <Text style={styles.body}>Signed in as {user.email ?? 'your Google account'}</Text>
      <Button
        label="Sign out"
        variant="secondary"
        onPress={async () => {
          await signOut();
          router.replace('/');
        }}
      />

      <View style={styles.section}>
        <Text accessibilityRole="header" aria-level={2} style={styles.heading}>Progress on this device</Text>
        <Text style={styles.body}>
          Your XP, hearts, streak and finished lessons are saved in this browser.
        </Text>
        {notice ? (
          <Text accessibilityLiveRegion="polite" style={styles.notice}>{notice}</Text>
        ) : null}
        {confirmingErase ? (
          <>
            <Text style={styles.warning}>Erase all progress on this device? This can't be undone.</Text>
            <Button
              label="Yes, erase my progress"
              onPress={() => {
                resetProgress();
                setConfirmingErase(false);
                setNotice('Your progress on this device has been erased.');
              }}
            />
            <Button label="Keep my progress" variant="secondary" onPress={() => setConfirmingErase(false)} />
          </>
        ) : (
          <Button label="Erase my progress" variant="secondary" onPress={() => { setNotice(null); setConfirmingErase(true); }} />
        )}
      </View>

      <View style={styles.section}>
        <Text accessibilityRole="header" aria-level={2} style={styles.heading}>Delete your account</Text>
        <Text style={styles.body}>
          This permanently deletes your Biso account and erases your progress on this device.
        </Text>
        {error ? (
          <Text accessibilityLiveRegion="polite" style={styles.error}>{error}</Text>
        ) : null}
        {confirmingDelete ? (
          <>
            <Text style={styles.warning}>Delete your account for good? This can't be undone.</Text>
            <Button label={busy ? 'Deleting...' : 'Yes, delete my account'} disabled={busy} onPress={removeAccount} />
            <Button label="Keep my account" variant="secondary" disabled={busy} onPress={() => setConfirmingDelete(false)} />
          </>
        ) : (
          <Button label="Delete my account" variant="secondary" onPress={() => { setError(null); setConfirmingDelete(true); }} />
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.brown,
    fontSize: 32,
    fontWeight: '800',
  },
  section: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 2,
    gap: spacing.sm,
    padding: spacing.md,
  },
  heading: {
    color: colors.brown,
    fontSize: 20,
    fontWeight: '800',
  },
  body: {
    color: colors.brown,
    fontSize: 16,
    lineHeight: 24,
  },
  warning: {
    color: colors.rustDark,
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 24,
  },
  notice: {
    color: colors.tealDark,
    fontSize: 15,
    fontWeight: '700',
  },
  error: {
    color: colors.rustDark,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 22,
  },
});
