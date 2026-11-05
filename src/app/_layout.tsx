import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { colors } from '@/theme';

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
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="lesson/[lessonId]" options={{ title: 'Lesson' }} />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}
