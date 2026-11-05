import type { Exercise, Lesson } from '../course/types';

export const MAX_HEARTS = 5;
export const XP_PER_CORRECT = 2;
export const XP_FOR_FIRST_COMPLETION = 10;

/** Saves from before languages existed were all Spanish. */
const LEGACY_COURSE_ID = 'es-from-en';

export type CourseProgress = {
  completedLessons: string[];
  /** Exercises answered wrong and not yet answered right since. */
  mistakes: string[];
};

/** XP, hearts and streak are shared; lesson progress is kept per language. */
export type Progress = {
  xp: number;
  hearts: number;
  streakCount: number;
  /** Local date of the last finished session, as YYYY-MM-DD. */
  lastActiveDay: string | null;
  currentCourseId: string | null;
  courses: Record<string, CourseProgress>;
};

export const initialProgress: Progress = {
  xp: 0,
  hearts: MAX_HEARTS,
  streakCount: 0,
  lastActiveDay: null,
  currentCourseId: null,
  courses: {},
};

const EMPTY_COURSE_PROGRESS: CourseProgress = {
  completedLessons: [],
  mistakes: [],
};

export function courseProgress(
  progress: Progress,
  courseId: string,
): CourseProgress {
  return progress.courses[courseId] ?? EMPTY_COURSE_PROGRESS;
}

function withCourse(
  progress: Progress,
  courseId: string,
  change: Partial<CourseProgress>,
): Progress {
  return {
    ...progress,
    courses: {
      ...progress.courses,
      [courseId]: { ...courseProgress(progress, courseId), ...change },
    },
  };
}

export function chooseCourse(progress: Progress, courseId: string): Progress {
  return { ...progress, currentCourseId: courseId };
}

export function dayKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

function daysBetween(from: string, to: string): number {
  return Math.round((Date.parse(to) - Date.parse(from)) / 86_400_000);
}

function addMistake(mistakes: string[], id: string): string[] {
  return mistakes.includes(id) ? mistakes : [...mistakes, id];
}

function removeMistake(mistakes: string[], id: string): string[] {
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
  courseId: string,
  exerciseId: string,
  correct: boolean,
): Progress {
  const { mistakes } = courseProgress(progress, courseId);
  if (correct) {
    return withCourse(
      { ...progress, xp: progress.xp + XP_PER_CORRECT },
      courseId,
      { mistakes: removeMistake(mistakes, exerciseId) },
    );
  }
  return withCourse(
    { ...progress, hearts: Math.max(progress.hearts - 1, 0) },
    courseId,
    { mistakes: addMistake(mistakes, exerciseId) },
  );
}

/** Practice never costs a heart, and each right answer earns one back. */
export function answerInPractice(
  progress: Progress,
  courseId: string,
  exerciseId: string,
  correct: boolean,
): Progress {
  const { mistakes } = courseProgress(progress, courseId);
  if (correct) {
    return withCourse(
      {
        ...progress,
        xp: progress.xp + XP_PER_CORRECT,
        hearts: Math.min(progress.hearts + 1, MAX_HEARTS),
      },
      courseId,
      { mistakes: removeMistake(mistakes, exerciseId) },
    );
  }
  return withCourse(progress, courseId, {
    mistakes: addMistake(mistakes, exerciseId),
  });
}

export function completeLesson(
  progress: Progress,
  courseId: string,
  lessonId: string,
  today: string,
): Progress {
  const { completedLessons } = courseProgress(progress, courseId);
  const firstTime = !completedLessons.includes(lessonId);
  return markActive(
    withCourse(
      {
        ...progress,
        xp: progress.xp + (firstTime ? XP_FOR_FIRST_COMPLETION : 0),
      },
      courseId,
      {
        completedLessons: firstTime
          ? [...completedLessons, lessonId]
          : completedLessons,
      },
    ),
    today,
  );
}

export function completePractice(progress: Progress, today: string): Progress {
  return markActive(progress, today);
}

/** A lesson opens once the one before it, in course order, is complete. */
export function isLessonUnlocked(
  lessons: Lesson[],
  completedLessons: string[],
  lessonId: string,
): boolean {
  const index = lessons.findIndex((lesson) => lesson.id === lessonId);
  if (index < 0) return false;
  if (index === 0) return true;
  return completedLessons.includes(lessons[index - 1].id);
}

export type LevelStatus = 'done' | 'open' | 'locked' | 'soon';

/** A level with no lessons yet is coming soon, whatever else has been done. */
export function levelStatus(
  levelLessons: Lesson[],
  allLessons: Lesson[],
  completedLessons: string[],
): LevelStatus {
  if (levelLessons.length === 0) return 'soon';
  if (levelLessons.every((lesson) => completedLessons.includes(lesson.id))) {
    return 'done';
  }
  return isLessonUnlocked(allLessons, completedLessons, levelLessons[0].id)
    ? 'open'
    : 'locked';
}

/** Where Viso stands: the first open stop, or the last finished one. */
export function currentStopIndex(statuses: string[]): number {
  const open = statuses.indexOf('open');
  if (open >= 0) return open;
  const lastDone = statuses.lastIndexOf('done');
  return lastDone >= 0 ? lastDone : 0;
}

/** Past mistakes come first, then other exercises from unlocked lessons. */
export function buildPracticeSet(
  lessons: Lesson[],
  current: CourseProgress,
  limit: number,
  order: (exercises: Exercise[]) => Exercise[] = (exercises) => exercises,
): Exercise[] {
  const available = lessons
    .filter((lesson) =>
      isLessonUnlocked(lessons, current.completedLessons, lesson.id),
    )
    .flatMap((lesson) => lesson.exercises);
  const isMistake = (exercise: Exercise) =>
    current.mistakes.includes(exercise.id);

  const everyMistake = lessons
    .flatMap((lesson) => lesson.exercises)
    .filter(isMistake);
  const others = available.filter((exercise) => !isMistake(exercise));

  return [...order(everyMistake), ...order(others)].slice(0, limit);
}

function parseIds(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : [];
}

function parseCourses(value: unknown): Record<string, CourseProgress> {
  if (typeof value !== 'object' || value === null) return {};

  const courses: Record<string, CourseProgress> = {};
  for (const [id, saved] of Object.entries(value)) {
    if (typeof saved !== 'object' || saved === null) continue;
    const entry = saved as Record<string, unknown>;
    courses[id] = {
      completedLessons: parseIds(entry.completedLessons),
      mistakes: parseIds(entry.mistakes),
    };
  }
  return courses;
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
  const lastActive = data.lastActiveDay;
  const isLegacy =
    Array.isArray(data.completedLessons) || Array.isArray(data.mistakes);

  const courses = parseCourses(data.courses);
  if (isLegacy && !courses[LEGACY_COURSE_ID]) {
    courses[LEGACY_COURSE_ID] = {
      completedLessons: parseIds(data.completedLessons),
      mistakes: parseIds(data.mistakes),
    };
  }

  let currentCourseId: string | null = null;
  if (typeof data.currentCourseId === 'string') {
    currentCourseId = data.currentCourseId;
  } else if (isLegacy) {
    currentCourseId = LEGACY_COURSE_ID;
  }

  return {
    xp: count(data.xp, 0),
    hearts: Math.min(count(data.hearts, MAX_HEARTS), MAX_HEARTS),
    streakCount: count(data.streakCount, 0),
    lastActiveDay:
      typeof lastActive === 'string' && !Number.isNaN(Date.parse(lastActive))
        ? lastActive
        : null,
    currentCourseId,
    courses,
  };
}
