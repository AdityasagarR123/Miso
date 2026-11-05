import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

type InstallPromptEvent = Event & { prompt: () => Promise<void> };

let deferredPrompt: InstallPromptEvent | null = null;
let installed = false;
const listeners = new Set<() => void>();

function notify() {
  for (const listener of listeners) listener();
}

function addHeadTag(tag: 'link' | 'meta', attributes: Record<string, string>) {
  const element = document.createElement(tag);
  for (const [name, value] of Object.entries(attributes)) {
    element.setAttribute(name, value);
  }
  document.head.appendChild(element);
}

// Runs on load so that the browser's install event is not missed, because it
// can fire before any screen has been shown.
if (Platform.OS === 'web' && typeof window !== 'undefined') {
  addHeadTag('link', { rel: 'manifest', href: '/manifest.webmanifest' });
  addHeadTag('link', { rel: 'apple-touch-icon', href: '/icon-192.png' });
  addHeadTag('meta', { name: 'theme-color', content: '#1C1411' });

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event as InstallPromptEvent;
    notify();
  });
  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    installed = true;
    notify();
  });
}

function isRunningInstalled(): boolean {
  return (
    Platform.OS === 'web' &&
    typeof window !== 'undefined' &&
    window.matchMedia('(display-mode: standalone)').matches
  );
}

export function useInstall() {
  const [, setVersion] = useState(0);

  useEffect(() => {
    const listener = () => setVersion((version) => version + 1);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  return {
    /** The browser can show its own install prompt right now. */
    canPrompt: deferredPrompt !== null,
    isInstalled: installed || isRunningInstalled(),
    prompt: async () => {
      const event = deferredPrompt;
      if (!event) return;
      // The browser allows each prompt to be used only once.
      deferredPrompt = null;
      notify();
      await event.prompt();
    },
  };
}
