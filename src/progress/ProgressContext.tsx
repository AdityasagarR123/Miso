import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import {
  answerInLesson,
  answerInPractice,
  completeLesson,
  completePractice,
  dayKey,
  initialProgress,
  parseProgress,
  type Progress,
} from './progress';

const STORAGE_KEY = 'miso.progress';

type ProgressContextValue = {
  progress: Progress;
  recordLessonAnswer: (exerciseId: string, correct: boolean) => void;
  recordPracticeAnswer: (exerciseId: string, correct: boolean) => void;
  finishLesson: (lessonId: string) => void;
  finishPractice: () => void;
};

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState(initialProgress);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => setProgress(parseProgress(raw)))
      // If storage is unavailable, the app still works for this visit.
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(progress)).catch(() => {});
  }, [loaded, progress]);

  const value = useMemo<ProgressContextValue>(
    () => ({
      progress,
      recordLessonAnswer: (exerciseId, correct) =>
        setProgress((prev) => answerInLesson(prev, exerciseId, correct)),
      recordPracticeAnswer: (exerciseId, correct) =>
        setProgress((prev) => answerInPractice(prev, exerciseId, correct)),
      finishLesson: (lessonId) =>
        setProgress((prev) => completeLesson(prev, lessonId, dayKey(new Date()))),
      finishPractice: () =>
        setProgress((prev) => completePractice(prev, dayKey(new Date()))),
    }),
    [progress],
  );

  if (!loaded) return null;

  return (
    <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
  );
}

export function useProgress(): ProgressContextValue {
  const value = useContext(ProgressContext);
  if (!value) throw new Error('useProgress must be used inside ProgressProvider');
  return value;
}
