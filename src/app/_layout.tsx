import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { AuthProvider } from '@/auth/AuthContext';
import { ConfettiHost } from '@/components/Confetti';
import { CookieNotice } from '@/components/site/CookieNotice';
import { ProgressProvider } from '@/progress/ProgressContext';
import { HOME_META, LANGUAGES_META } from '@/site/content';
import { colors } from '@/theme';

// Keeps the lesson list behind a lesson that was opened by link or refreshed,
// so the back arrow is always there.
export const unstable_settings = {
  anchor: 'learn',
};

export default function RootLayout() {
  return (
    <AuthProvider>
    <ProgressProvider>
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: colors.cream },
          headerShadowVisible: false,
          headerStyle: { backgroundColor: colors.cream },
          headerTintColor: colors.brown,
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false, title: HOME_META.title }} />
        <Stack.Screen name="learn" options={{ headerShown: false, title: 'Biso' }} />
        <Stack.Screen name="level/[levelId]" options={{ title: 'Level' }} />
        <Stack.Screen name="lesson/[lessonId]" options={{ title: 'Lesson' }} />
        <Stack.Screen name="practice" options={{ title: 'Practice' }} />
        <Stack.Screen name="sign-in" options={{ title: 'Sign in' }} />
        <Stack.Screen name="languages" options={{ headerShown: false, title: LANGUAGES_META.title }} />
        <Stack.Screen name="account" options={{ title: 'Account' }} />
      </Stack>
      <StatusBar style="dark" />
      <ConfettiHost />
      <CookieNotice />
    </ProgressProvider>
    </AuthProvider>
  );
}
