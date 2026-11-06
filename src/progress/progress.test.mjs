import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  MAX_HEARTS,
  answerInLesson,
  answerInPractice,
  buildPracticeSet,
  chooseCourse,
  completeLesson,
  completePractice,
  courseProgress,
  currentStopIndex,
  currentStreak,
  dayKey,
  initialProgress,
  isLessonUnlocked,
  levelStatus,
  parseProgress,
} from './progress.ts';

const ES = 'es-from-en';
const FR = 'fr-from-en';

const exercise = (id) => ({ id });
const lessons = [
  { id: 'a', exercises: [exercise('a1'), exercise('a2')] },
  { id: 'b', exercises: [exercise('b1'), exercise('b2')] },
  { id: 'c', exercises: [exercise('c1')] },
];

const withEs = (es, extra = {}) => ({
  ...initialProgress,
  ...extra,
  courses: { [ES]: { completedLessons: [], mistakes: [], ...es } },
});

test('a right answer in a lesson earns XP and clears the mistake', () => {
  const next = answerInLesson(withEs({ mistakes: ['a1'] }), ES, 'a1', true);
  assert.equal(next.xp, 2);
  assert.equal(next.hearts, MAX_HEARTS);
  assert.deepEqual(courseProgress(next, ES).mistakes, []);
});

test('a wrong answer in a lesson costs a heart and is remembered once', () => {
  let next = answerInLesson(initialProgress, ES, 'a1', false);
  next = answerInLesson(next, ES, 'a1', false);
  assert.equal(next.hearts, MAX_HEARTS - 2);
  assert.equal(next.xp, 0);
  assert.deepEqual(courseProgress(next, ES).mistakes, ['a1']);
});

test('hearts never drop below zero', () => {
  const next = answerInLesson({ ...initialProgress, hearts: 0 }, ES, 'a1', false);
  assert.equal(next.hearts, 0);
});

test('practice earns hearts up to the maximum and never costs one', () => {
  const low = withEs({ mistakes: ['a1'] }, { hearts: 1 });
  const right = answerInPractice(low, ES, 'a1', true);
  assert.equal(right.hearts, 2);
  assert.deepEqual(courseProgress(right, ES).mistakes, []);

  const wrong = answerInPractice(low, ES, 'a2', false);
  assert.equal(wrong.hearts, 1);
  assert.deepEqual(courseProgress(wrong, ES).mistakes, ['a1', 'a2']);

  assert.equal(answerInPractice(initialProgress, ES, 'a1', true).hearts, MAX_HEARTS);
});

test('only the first completion of a lesson earns the bonus', () => {
  const once = completeLesson(initialProgress, ES, 'a', '2026-11-05');
  const twice = completeLesson(once, ES, 'a', '2026-11-05');
  assert.equal(once.xp, 10);
  assert.equal(twice.xp, 10);
  assert.deepEqual(courseProgress(twice, ES).completedLessons, ['a']);
});

test('lesson progress is separate per language, and XP is shared', () => {
  let p = completeLesson(initialProgress, ES, 'a', '2026-11-05');
  p = answerInLesson(p, ES, 'a1', false);
  p = completeLesson(p, FR, 'a', '2026-11-05');
  assert.deepEqual(courseProgress(p, ES).completedLessons, ['a']);
  assert.deepEqual(courseProgress(p, FR).completedLessons, ['a']);
  assert.deepEqual(courseProgress(p, ES).mistakes, ['a1']);
  assert.deepEqual(courseProgress(p, FR).mistakes, []);
  assert.equal(p.xp, 20);
  assert.equal(p.hearts, MAX_HEARTS - 1);
  assert.equal(p.streakCount, 1);
});

test('choosing a language keeps its progress and the others', () => {
  const start = withEs({ completedLessons: ['a'] });
  const chosen = chooseCourse(start, FR);
  assert.equal(chosen.currentCourseId, FR);
  assert.deepEqual(courseProgress(chosen, ES).completedLessons, ['a']);
});

test('streaks grow on new days, once a day, and restart after a gap', () => {
  let p = completeLesson(initialProgress, ES, 'a', '2026-11-05');
  assert.equal(p.streakCount, 1);
  p = completePractice(p, '2026-11-05');
  assert.equal(p.streakCount, 1);
  p = completePractice(p, '2026-11-06');
  assert.equal(p.streakCount, 2);
  p = completePractice(p, '2026-11-09');
  assert.equal(p.streakCount, 1);
});

test('streaks cross month and year boundaries', () => {
  let p = completePractice(initialProgress, '2026-12-31');
  p = completePractice(p, '2027-01-01');
  assert.equal(p.streakCount, 2);
});

test('a date earlier than the last active day leaves the streak alone', () => {
  let p = completePractice(initialProgress, '2026-11-05');
  p = completePractice(p, '2026-11-04');
  assert.equal(p.streakCount, 1);
  assert.equal(p.lastActiveDay, '2026-11-05');
});

test('the shown streak survives until a whole day is missed', () => {
  const p = { ...initialProgress, streakCount: 4, lastActiveDay: '2026-11-05' };
  assert.equal(currentStreak(p, '2026-11-05'), 4);
  assert.equal(currentStreak(p, '2026-11-06'), 4);
  assert.equal(currentStreak(p, '2026-11-07'), 0);
  assert.equal(currentStreak(initialProgress, '2026-11-05'), 0);
});

test('dayKey uses the local date with padding', () => {
  assert.equal(dayKey(new Date(2026, 0, 3, 23, 59)), '2026-01-03');
});

test('lessons unlock one at a time', () => {
  assert.equal(isLessonUnlocked(lessons, [], 'a'), true);
  assert.equal(isLessonUnlocked(lessons, [], 'b'), false);
  assert.equal(isLessonUnlocked(lessons, ['a'], 'b'), true);
  assert.equal(isLessonUnlocked(lessons, ['a'], 'c'), false);
  assert.equal(isLessonUnlocked(lessons, ['a'], 'missing'), false);
});

test('level status follows its lessons', () => {
  const first = [lessons[0], lessons[1]];
  const second = [lessons[2]];
  assert.equal(levelStatus([], lessons, []), 'soon');
  assert.equal(levelStatus([], lessons, ['a', 'b', 'c']), 'soon');
  assert.equal(levelStatus(first, lessons, []), 'open');
  assert.equal(levelStatus(first, lessons, ['a']), 'open');
  assert.equal(levelStatus(first, lessons, ['a', 'b']), 'done');
  assert.equal(levelStatus(second, lessons, []), 'locked');
  assert.equal(levelStatus(second, lessons, ['a']), 'locked');
  assert.equal(levelStatus(second, lessons, ['a', 'b']), 'open');
});

test('Biso stands at the first open stop, or the last finished one', () => {
  assert.equal(currentStopIndex(['open', 'soon', 'soon']), 0);
  assert.equal(currentStopIndex(['done', 'done', 'open', 'locked']), 2);
  assert.equal(currentStopIndex(['done', 'done', 'soon']), 1);
  assert.equal(currentStopIndex(['done', 'done']), 1);
  assert.equal(currentStopIndex(['soon', 'soon']), 0);
  assert.equal(currentStopIndex([]), 0);
});

test('practice puts mistakes first and skips locked lessons', () => {
  const current = { completedLessons: [], mistakes: ['a2'] };
  assert.deepEqual(
    buildPracticeSet(lessons, current, 5).map((e) => e.id),
    ['a2', 'a1'],
  );
});

test('practice respects its limit and includes newly unlocked lessons', () => {
  const current = { completedLessons: ['a'], mistakes: ['b2'] };
  assert.deepEqual(
    buildPracticeSet(lessons, current, 3).map((e) => e.id),
    ['b2', 'a1', 'a2'],
  );
});

test('saved progress round-trips', () => {
  const p = {
    xp: 12,
    hearts: 3,
    streakCount: 2,
    lastActiveDay: '2026-11-05',
    currentCourseId: FR,
    courses: {
      [ES]: { completedLessons: ['a'], mistakes: ['b1'] },
      [FR]: { completedLessons: [], mistakes: [] },
    },
  };
  assert.deepEqual(parseProgress(JSON.stringify(p)), p);
});

test('a save from before languages becomes Spanish progress', () => {
  const old = JSON.stringify({
    xp: 30,
    hearts: 4,
    streakCount: 2,
    lastActiveDay: '2026-11-05',
    completedLessons: ['greetings'],
    mistakes: ['introductions-1'],
  });
  assert.deepEqual(parseProgress(old), {
    xp: 30,
    hearts: 4,
    streakCount: 2,
    lastActiveDay: '2026-11-05',
    currentCourseId: ES,
    courses: {
      [ES]: { completedLessons: ['greetings'], mistakes: ['introductions-1'] },
    },
  });
});

test('a new learner has not chosen a language', () => {
  assert.equal(parseProgress(null).currentCourseId, null);
});

test('damaged saved progress falls back safely', () => {
  assert.deepEqual(parseProgress(null), initialProgress);
  assert.deepEqual(parseProgress('not json'), initialProgress);
  assert.deepEqual(parseProgress('null'), initialProgress);
  assert.deepEqual(parseProgress('42'), initialProgress);

  const fixed = parseProgress(
    JSON.stringify({
      xp: -5,
      hearts: 99,
      streakCount: 'x',
      lastActiveDay: 'nope',
      currentCourseId: 7,
      courses: {
        [ES]: { completedLessons: ['a', 1], mistakes: 'b' },
        [FR]: 'broken',
      },
    }),
  );
  assert.deepEqual(fixed, {
    xp: 0,
    hearts: MAX_HEARTS,
    streakCount: 0,
    lastActiveDay: null,
    currentCourseId: null,
    courses: { [ES]: { completedLessons: ['a'], mistakes: [] } },
  });
});
