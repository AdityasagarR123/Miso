import type { Exercise, Lesson } from '../course/types';

export const MAX_HEARTS = 5;
export const XP_PER_CORRECT = 2;
export const XP_FOR_FIRST_COMPLETION = 10;

export type Progress = {
  xp: number;
  hearts: number;
  streakCount: number;
  /** Local date of the last finished session, as YYYY-MM-DD. */
  lastActiveDay: string | null;
  completedLessons: string[];
  /** Exercises answered wrong and not yet answered right since. */
  mistakes: string[];
};

export const initialProgress: Progress = {
  xp: 0,
  hearts: MAX_HEARTS,
  streakCount: 0,
  lastActiveDay: null,
  completedLessons: [],
  mistakes: [],
};

export function dayKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

function daysBetween(from: string, to: string): number {
  return Math.round((Date.parse(to) - Date.parse(from)) / 86_400_000);
}

function withMistake(mistakes: string[], id: string): string[] {
  return mistakes.includes(id) ? mistakes : [...mistakes, id];
}

function withoutMistake(mistakes: string[], id: string): string[] {
  return mistakes.filter((other) => other !== id);
}

function markActive(progress: Progress, today: string): Progress {
  const last = progress.lastActiveDay;
  if (last === null) {
    return { ...progress, streakCount: 1, lastActiveDay: today };
  }

  const gap = daysBetween(last, today);
  if (gap <= 0) return progress;
  return {
    ...progress,
    streakCount: gap === 1 ? progress.streakCount + 1 : 1,
    lastActiveDay: today,
  };
}

/** The streak to show today: it drops to 0 once a whole day has been missed. */
export function currentStreak(progress: Progress, today: string): number {
  if (progress.lastActiveDay === null) return 0;
  return daysBetween(progress.lastActiveDay, today) <= 1
    ? progress.streakCount
    : 0;
}

export function answerInLesson(
  progress: Progress,
  exerciseId: string,
  correct: boolean,
): Progress {
  if (correct) {
    return {
      ...progress,
      xp: progress.xp + XP_PER_CORRECT,
      mistakes: withoutMistake(progress.mistakes, exerciseId),
    };
  }
  return {
    ...progress,
    hearts: Math.max(progress.hearts - 1, 0),
    mistakes: withMistake(progress.mistakes, exerciseId),
  };
}

/** Practice never costs a heart, and each right answer earns one back. */
export function answerInPractice(
  progress: Progress,
  exerciseId: string,
  correct: boolean,
): Progress {
  if (correct) {
    return {
      ...progress,
      xp: progress.xp + XP_PER_CORRECT,
      hearts: Math.min(progress.hearts + 1, MAX_HEARTS),
      mistakes: withoutMistake(progress.mistakes, exerciseId),
    };
  }
  return {
    ...progress,
    mistakes: withMistake(progress.mistakes, exerciseId),
  };
}

export function completeLesson(
  progress: Progress,
  lessonId: string,
  today: string,
): Progress {
  const firstTime = !progress.completedLessons.includes(lessonId);
  return markActive(
    {
      ...progress,
      xp: progress.xp + (firstTime ? XP_FOR_FIRST_COMPLETION : 0),
      completedLessons: firstTime
        ? [...progress.completedLessons, lessonId]
        : progress.completedLessons,
    },
    today,
  );
}

export function completePractice(progress: Progress, today: string): Progress {
  return markActive(progress, today);
}

/** A lesson opens once the one before it, in course order, is complete. */
export function isLessonUnlocked(
  lessons: Lesson[],
  progress: Progress,
  lessonId: string,
): boolean {
  const index = lessons.findIndex((lesson) => lesson.id === lessonId);
  if (index < 0) return false;
  if (index === 0) return true;
  return progress.completedLessons.includes(lessons[index - 1].id);
}

/** Past mistakes come first, then other exercises from unlocked lessons. */
export function buildPracticeSet(
  lessons: Lesson[],
  progress: Progress,
  limit: number,
  order: (exercises: Exercise[]) => Exercise[] = (exercises) => exercises,
): Exercise[] {
  const available = lessons
    .filter((lesson) => isLessonUnlocked(lessons, progress, lesson.id))
    .flatMap((lesson) => lesson.exercises);
  const isMistake = (exercise: Exercise) =>
    progress.mistakes.includes(exercise.id);

  const everyMistake = lessons
    .flatMap((lesson) => lesson.exercises)
    .filter(isMistake);
  const others = available.filter((exercise) => !isMistake(exercise));

  return [...order(everyMistake), ...order(others)].slice(0, limit);
}

/** Reads saved progress, falling back to a fresh start if it is damaged. */
export function parseProgress(raw: string | null): Progress {
  if (raw === null) return initialProgress;

  let saved: unknown;
  try {
    saved = JSON.parse(raw);
  } catch {
    return initialProgress;
  }
  if (typeof saved !== 'object' || saved === null) return initialProgress;

  const data = saved as Record<string, unknown>;
  const count = (value: unknown, fallback: number) =>
    typeof value === 'number' && Number.isFinite(value) && value >= 0
      ? Math.floor(value)
      : fallback;
  const ids = (value: unknown) =>
    Array.isArray(value)
      ? value.filter((item): item is string => typeof item === 'string')
      : [];
  const lastActive = data.lastActiveDay;

  return {
    xp: count(data.xp, 0),
    hearts: Math.min(count(data.hearts, MAX_HEARTS), MAX_HEARTS),
    streakCount: count(data.streakCount, 0),
    lastActiveDay:
      typeof lastActive === 'string' && !Number.isNaN(Date.parse(lastActive))
        ? lastActive
        : null,
    completedLessons: ids(data.completedLessons),
    mistakes: ids(data.mistakes),
  };
}
