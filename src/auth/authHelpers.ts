/** Only ever return to a page inside Biso, never to an outside address. */
export function safeNextPath(next: unknown): string {
  if (typeof next !== 'string') return '/learn';
  const isInternal =
    next.startsWith('/') && !next.startsWith('//') && !next.includes('\\');
  return isInternal ? next : '/learn';
}

const MESSAGES: Record<string, string> = {
  'auth/invalid-email': "That email address doesn't look right.",
  'auth/missing-email': 'Please enter your email address.',
  'auth/missing-password': 'Please enter your password.',
  'auth/weak-password': 'Please choose a password of at least 6 characters.',
  'auth/email-already-in-use':
    'That email already has an account. Try signing in instead.',
  // Firebase deliberately doesn't reveal which of these it was.
  'auth/invalid-credential': "That email or password isn't right.",
  'auth/wrong-password': "That email or password isn't right.",
  'auth/user-not-found': "That email or password isn't right.",
  'auth/too-many-requests': 'Too many tries. Please wait a little and try again.',
  'auth/network-request-failed': 'Please check your internet connection and try again.',
  'auth/popup-blocked': 'Your browser blocked the Google window. Please allow pop-ups and try again.',
  'auth/unauthorized-domain': "Google sign-in isn't enabled for this website yet.",
  'auth/operation-not-allowed': "This way of signing in isn't turned on yet.",
};

/** Firebase's error codes, in words a learner can act on. */
export function friendlyAuthError(error: unknown): string | null {
  const code = (error as { code?: unknown } | null)?.code;
  // Closing the Google window on purpose isn't an error worth showing.
  if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
    return null;
  }
  return (
    (typeof code === 'string' ? MESSAGES[code] : undefined) ??
    'Something went wrong. Please try again.'
  );
}
