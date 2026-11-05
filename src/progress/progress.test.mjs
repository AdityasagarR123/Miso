import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  MAX_HEARTS,
  answerInLesson,
  answerInPractice,
  buildPracticeSet,
  completeLesson,
  completePractice,
  currentStreak,
  dayKey,
  initialProgress,
  isLessonUnlocked,
  parseProgress,
} from './progress.ts';

const exercise = (id) => ({ id });
const lessons = [
  { id: 'a', exercises: [exercise('a1'), exercise('a2')] },
  { id: 'b', exercises: [exercise('b1'), exercise('b2')] },
  { id: 'c', exercises: [exercise('c1')] },
];

test('a right answer in a lesson earns XP and clears the mistake', () => {
  const start = { ...initialProgress, mistakes: ['a1'] };
  const next = answerInLesson(start, 'a1', true);
  assert.equal(next.xp, 2);
  assert.equal(next.hearts, MAX_HEARTS);
  assert.deepEqual(next.mistakes, []);
});

test('a wrong answer in a lesson costs a heart and is remembered once', () => {
  let next = answerInLesson(initialProgress, 'a1', false);
  next = answerInLesson(next, 'a1', false);
  assert.equal(next.hearts, MAX_HEARTS - 2);
  assert.equal(next.xp, 0);
  assert.deepEqual(next.mistakes, ['a1']);
});

test('hearts never drop below zero', () => {
  const next = answerInLesson({ ...initialProgress, hearts: 0 }, 'a1', false);
  assert.equal(next.hearts, 0);
});

test('practice earns hearts up to the maximum and never costs one', () => {
  const low = { ...initialProgress, hearts: 1, mistakes: ['a1'] };
  const right = answerInPractice(low, 'a1', true);
  assert.equal(right.hearts, 2);
  assert.deepEqual(right.mistakes, []);

  const wrong = answerInPractice(low, 'a2', false);
  assert.equal(wrong.hearts, 1);
  assert.deepEqual(wrong.mistakes, ['a1', 'a2']);

  assert.equal(answerInPractice(initialProgress, 'a1', true).hearts, MAX_HEARTS);
});

test('only the first completion of a lesson earns the bonus', () => {
  const once = completeLesson(initialProgress, 'a', '2026-11-05');
  const twice = completeLesson(once, 'a', '2026-11-05');
  assert.equal(once.xp, 10);
  assert.equal(twice.xp, 10);
  assert.deepEqual(twice.completedLessons, ['a']);
});

test('streaks grow on new days, once a day, and restart after a gap', () => {
  let p = completeLesson(initialProgress, 'a', '2026-11-05');
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
  assert.equal(isLessonUnlocked(lessons, initialProgress, 'a'), true);
  assert.equal(isLessonUnlocked(lessons, initialProgress, 'b'), false);
  const p = { ...initialProgress, completedLessons: ['a'] };
  assert.equal(isLessonUnlocked(lessons, p, 'b'), true);
  assert.equal(isLessonUnlocked(lessons, p, 'c'), false);
  assert.equal(isLessonUnlocked(lessons, p, 'missing'), false);
});

test('practice puts mistakes first and skips locked lessons', () => {
  const p = { ...initialProgress, mistakes: ['a2'] };
  assert.deepEqual(
    buildPracticeSet(lessons, p, 5).map((e) => e.id),
    ['a2', 'a1'],
  );
});

test('practice respects its limit and includes newly unlocked lessons', () => {
  const p = { ...initialProgress, completedLessons: ['a'], mistakes: ['b2'] };
  assert.deepEqual(
    buildPracticeSet(lessons, p, 3).map((e) => e.id),
    ['b2', 'a1', 'a2'],
  );
});

test('saved progress round-trips', () => {
  const p = {
    xp: 12,
    hearts: 3,
    streakCount: 2,
    lastActiveDay: '2026-11-05',
    completedLessons: ['a'],
    mistakes: ['b1'],
  };
  assert.deepEqual(parseProgress(JSON.stringify(p)), p);
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
      completedLessons: ['a', 1],
      mistakes: 'b',
    }),
  );
  assert.deepEqual(fixed, {
    xp: 0,
    hearts: MAX_HEARTS,
    streakCount: 0,
    lastActiveDay: null,
    completedLessons: ['a'],
    mistakes: [],
  });
});
