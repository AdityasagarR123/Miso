// Stops a website build that has no Firebase project, because that site would
// lock everyone out of lessons. The previous deployment stays live instead.
const required = [
  'EXPO_PUBLIC_FIREBASE_API_KEY',
  'EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'EXPO_PUBLIC_FIREBASE_PROJECT_ID',
  'EXPO_PUBLIC_FIREBASE_APP_ID',
];

const missing = required.filter((name) => !process.env[name]);

if (missing.length > 0) {
  console.error(`Firebase isn't connected. Missing: ${missing.join(', ')}`);
  process.exit(1);
}
