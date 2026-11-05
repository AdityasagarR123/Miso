import Constants from 'expo-constants';

const base = Constants.expoConfig?.experiments?.baseUrl ?? '';

/** Prefixes a file from the public folder, for sites served from a sub-path. */
export function publicUrl(path: string): string {
  return `${base}${path}`;
}
