import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import '@/lib/install';
import { ConfettiHost } from '@/components/Confetti';
import { ProgressProvider } from '@/progress/ProgressContext';
import { colors } from '@/theme';

// Keeps the lesson list behind a lesson that was opened by link or refreshed,
// so the back arrow is always there.
export const unstable_settings = {
  anchor: 'learn',
};

export default function RootLayout() {
  return (
    <ProgressProvider>
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: colors.cream },
          headerShadowVisible: false,
          headerStyle: { backgroundColor: colors.cream },
          headerTintColor: colors.brown,
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false, title: 'Viso' }} />
        <Stack.Screen name="learn" options={{ headerShown: false, title: 'Viso' }} />
        <Stack.Screen name="level/[levelId]" options={{ title: 'Level' }} />
        <Stack.Screen name="lesson/[lessonId]" options={{ title: 'Lesson' }} />
        <Stack.Screen name="practice" options={{ title: 'Practice' }} />
        <Stack.Screen name="languages" options={{ headerShown: false, title: 'Languages' }} />
      </Stack>
      <StatusBar style="dark" />
      <ConfettiHost />
    </ProgressProvider>
  );
}
