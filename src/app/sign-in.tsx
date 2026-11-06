import { Redirect, Stack, useLocalSearchParams, type Href } from 'expo-router';
import { useState } from 'react';
import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useAuth } from '@/auth/AuthContext';
import { friendlyAuthError, safeNextPath } from '@/auth/authHelpers';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { isFirebaseConfigured } from '@/lib/firebase';
import { colors, radius, spacing } from '@/theme';

const LOGO_FULL = require('../../assets/brand/biso-full.png');

type Mode = 'sign-in' | 'sign-up';

export default function SignInScreen() {
  const { user, loading, signIn, signUp, signInWithGoogle, resetPassword } =
    useAuth();
  const { next, mode: startMode } = useLocalSearchParams<{
    next?: string;
    mode?: string;
  }>();
  const [mode, setMode] = useState<Mode>(
    startMode === 'sign-in' ? 'sign-in' : 'sign-up',
  );
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Once signed in, carry on to whatever they were trying to play.
  if (user) return <Redirect href={safeNextPath(next) as Href} />;

  const creating = mode === 'sign-up';

  const run = async (action: () => Promise<void>) => {
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      await action();
    } catch (caught) {
      setError(friendlyAuthError(caught));
    } finally {
      setBusy(false);
    }
  };

  const submit = () =>
    run(() => (creating ? signUp(email, password) : signIn(email, password)));

  return (
    <Screen>
      <Stack.Screen options={{ title: creating ? 'Create account' : 'Sign in' }} />

      <View style={styles.hero}>
        <Image
          accessibilityLabel="Biso the red panda, waving"
          source={LOGO_FULL}
          resizeMode="contain"
          style={styles.logo}
        />
        <Text accessibilityRole="header" style={styles.title}>
          {creating ? 'Sign up to start playing' : 'Welcome back'}
        </Text>
        <Text style={styles.subtitle}>
          Biso is completely free. You just need an account to play lessons.
        </Text>
      </View>

      {!isFirebaseConfigured ? (
        <Text style={styles.error}>Sign-in isn't set up yet. Please check back soon.</Text>
      ) : (
        <>
          {Platform.OS === 'web' ? (
            <>
              <Button
                label="Continue with Google"
                variant="secondary"
                disabled={busy || loading}
                onPress={() => run(signInWithGoogle)}
              />
              <Text style={styles.or}>or use your email</Text>
            </>
          ) : null}

          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              accessibilityLabel="Email"
              autoCapitalize="none"
              autoComplete="email"
              inputMode="email"
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor="#8A7566"
              style={styles.input}
              value={email}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              accessibilityLabel="Password"
              autoCapitalize="none"
              autoComplete={creating ? 'new-password' : 'current-password'}
              onChangeText={setPassword}
              onSubmitEditing={submit}
              placeholder={creating ? 'At least 6 characters' : 'Your password'}
              placeholderTextColor="#8A7566"
              secureTextEntry
              style={styles.input}
              value={password}
            />
          </View>

          {error ? (
            <Text accessibilityLiveRegion="polite" style={styles.error}>
              {error}
            </Text>
          ) : null}
          {notice ? (
            <Text accessibilityLiveRegion="polite" style={styles.notice}>
              {notice}
            </Text>
          ) : null}

          <Button
            label={creating ? 'Create account' : 'Sign in'}
            disabled={busy || loading}
            onPress={submit}
          />

          {creating ? null : (
            <Pressable
              accessibilityRole="button"
              disabled={busy}
              onPress={() =>
                run(async () => {
                  await resetPassword(email);
                  setNotice('If that email has an account, a reset link is on its way.');
                })
              }
              style={styles.link}
            >
              <Text style={styles.linkText}>Forgot your password?</Text>
            </Pressable>
          )}

          <Pressable
            accessibilityRole="button"
            onPress={() => {
              setMode(creating ? 'sign-in' : 'sign-up');
              setError(null);
              setNotice(null);
            }}
            style={styles.link}
          >
            <Text style={styles.linkText}>
              {creating
                ? 'Already have an account? Sign in'
                : 'New to Biso? Create an account'}
            </Text>
          </Pressable>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  logo: {
    height: 120,
    width: 128,
  },
  title: {
    color: colors.brown,
    fontSize: 30,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    color: colors.brown,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  or: {
    color: colors.brown,
    fontSize: 14,
    textAlign: 'center',
  },
  field: {
    gap: spacing.xs,
  },
  label: {
    color: colors.brown,
    fontSize: 15,
    fontWeight: '700',
  },
  input: {
    backgroundColor: colors.white,
    borderColor: colors.brown,
    borderRadius: radius.md,
    borderWidth: 2,
    color: colors.brown,
    fontSize: 16,
    minHeight: 50,
    paddingHorizontal: spacing.md,
  },
  error: {
    backgroundColor: colors.rustLight,
    borderRadius: radius.md,
    color: colors.brown,
    fontSize: 15,
    lineHeight: 22,
    padding: spacing.sm,
  },
  notice: {
    backgroundColor: colors.tealLight,
    borderRadius: radius.md,
    color: colors.brown,
    fontSize: 15,
    lineHeight: 22,
    padding: spacing.sm,
  },
  link: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  linkText: {
    color: colors.tealDark,
    fontSize: 15,
    fontWeight: '700',
  },
});
