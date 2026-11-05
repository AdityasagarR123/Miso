import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { colors } from '@/theme';

// Keeps the home screen behind a lesson that was opened by link or refreshed,
// so the back arrow is always there.
export const unstable_settings = {
  anchor: 'index',
};

export default function RootLayout() {
  return (
    <>
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: colors.cream },
          headerShadowVisible: false,
          headerStyle: { backgroundColor: colors.cream },
          headerTintColor: colors.brown,
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false, title: 'Miso' }} />
        <Stack.Screen name="lesson/[lessonId]" options={{ title: 'Lesson' }} />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}
