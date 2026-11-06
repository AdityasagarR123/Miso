import { getApps, initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth, type Auth } from 'firebase/auth';

// A Firebase web config isn't a secret: it identifies the project, and Firebase
// protects accounts with its own rules and the list of allowed websites.
const config = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};
const emulatorUrl = process.env.EXPO_PUBLIC_FIREBASE_AUTH_EMULATOR;

export const isFirebaseConfigured = Boolean(
  config.apiKey && config.authDomain && config.projectId,
);

function createAuth(): Auth | null {
  if (!isFirebaseConfigured) return null;

  const app = getApps()[0] ?? initializeApp(config);
  const auth = getAuth(app);
  if (emulatorUrl) {
    connectAuthEmulator(auth, emulatorUrl, { disableWarnings: true });
  }
  return auth;
}

/** Null when no Firebase project is connected yet. */
export const auth = createAuth();
