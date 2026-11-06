import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { courseById } from '../course/courses';
import { lessonsOf } from '../course/levels';
import type { Course, Lesson } from '../course/types';
import {
  answerInLesson,
  answerInPractice,
  chooseCourse,
  completeLesson,
  completePractice,
  courseProgress,
  dayKey,
  initialProgress,
  parseProgress,
  type CourseProgress,
  type Progress,
} from './progress';

// Kept from the app's old name, so existing learners don't lose their progress.
const STORAGE_KEY = 'viso.progress';

type ProgressContextValue = {
  progress: Progress;
  /** The language being learned, or null if none is chosen yet. */
  course: Course | null;
  lessons: Lesson[];
  current: CourseProgress;
  selectCourse: (courseId: string) => void;
  recordLessonAnswer: (exerciseId: string, correct: boolean) => void;
  recordPracticeAnswer: (exerciseId: string, correct: boolean) => void;
  finishLesson: (lessonId: string) => void;
  finishPractice: () => void;
  /** Erases all progress saved on this device. */
  resetProgress: () => void;
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

  const value = useMemo<ProgressContextValue>(() => {
    const course = courseById(progress.currentCourseId);
    const courseId = course?.id ?? '';

    return {
      progress,
      course,
      lessons: course ? lessonsOf(course) : [],
      current: courseProgress(progress, courseId),
      selectCourse: (id) => setProgress((prev) => chooseCourse(prev, id)),
      recordLessonAnswer: (exerciseId, correct) =>
        setProgress((prev) =>
          answerInLesson(prev, courseId, exerciseId, correct),
        ),
      recordPracticeAnswer: (exerciseId, correct) =>
        setProgress((prev) =>
          answerInPractice(prev, courseId, exerciseId, correct),
        ),
      finishLesson: (lessonId) =>
        setProgress((prev) =>
          completeLesson(prev, courseId, lessonId, dayKey(new Date())),
        ),
      finishPractice: () =>
        setProgress((prev) => completePractice(prev, dayKey(new Date()))),
      resetProgress: () => setProgress(initialProgress),
    };
  }, [progress]);

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
