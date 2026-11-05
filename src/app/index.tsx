import { Redirect } from 'expo-router';
import { Platform } from 'react-native';

import { Landing } from '@/components/landing/Landing';

// The landing page is for the website. Phone apps go straight to the lessons.
export default function IndexScreen() {
  if (Platform.OS !== 'web') return <Redirect href="/learn" />;
  return <Landing />;
}
