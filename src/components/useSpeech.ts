import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

// Full language tags help the browser pick a native-sounding voice.
const VOICE_TAGS: Record<string, string> = {
  es: 'es-ES',
  fr: 'fr-FR',
  de: 'de-DE',
  it: 'it-IT',
  pt: 'pt-BR',
  ja: 'ja-JP',
  ko: 'ko-KR',
  zh: 'zh-CN',
  hi: 'hi-IN',
  ar: 'ar-SA',
};

function findVoice(code: string): SpeechSynthesisVoice | undefined {
  const voices = window.speechSynthesis.getVoices();
  const tag = VOICE_TAGS[code] ?? code;
  return (
    voices.find((voice) => voice.lang.replace('_', '-') === tag) ??
    voices.find((voice) => voice.lang.toLowerCase().startsWith(code.toLowerCase()))
  );
}

/**
 * Says words aloud with the browser's own voices, which are free. A stand-in
 * until Biso has recorded audio. Returns null when this browser has no voice
 * for the language, so the listen button can stay hidden.
 */
export function useSpeech(code: string): ((text: string) => void) | null {
  const [voice, setVoice] = useState<SpeechSynthesisVoice | undefined>();

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined' || !window.speechSynthesis) {
      return;
    }
    const update = () => setVoice(findVoice(code));
    update();
    // Browsers load their voice list a moment after the page.
    window.speechSynthesis.addEventListener('voiceschanged', update);
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', update);
      window.speechSynthesis.cancel();
    };
  }, [code]);

  if (!voice) return null;

  return (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voice;
    utterance.lang = voice.lang;
    utterance.rate = 0.85;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };
}
