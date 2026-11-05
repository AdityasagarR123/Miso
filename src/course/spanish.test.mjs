import assert from 'node:assert/strict';
import { test } from 'node:test';

import { allLessons, spanishCourse } from './spanish.ts';

const allExercises = allLessons.flatMap((lesson) => lesson.exercises);

function assertUnique(values, label) {
  const seen = new Set();
  for (const value of values) {
    assert.ok(!seen.has(value), `duplicate ${label}: ${value}`);
    seen.add(value);
  }
}

test('lesson, unit and exercise ids are unique', () => {
  assertUnique(spanishCourse.units.map((unit) => unit.id), 'unit id');
  assertUnique(allLessons.map((lesson) => lesson.id), 'lesson id');
  assertUnique(allExercises.map((exercise) => exercise.id), 'exercise id');
});

test('every lesson has exercises and every exercise a prompt', () => {
  for (const lesson of allLessons) {
    assert.ok(lesson.exercises.length > 0, `${lesson.id} is empty`);
    for (const exercise of lesson.exercises) {
      assert.ok(exercise.prompt.trim(), `${exercise.id} has no prompt`);
    }
  }
});

test('multiple choice answers are among distinct choices', () => {
  for (const e of allExercises.filter((e) => e.type === 'multiple_choice')) {
    assert.ok(e.choices.includes(e.answer), `${e.id}: answer not in choices`);
    assert.ok(e.choices.length >= 2, `${e.id}: too few choices`);
    assertUnique(e.choices, `${e.id} choice`);
  }
});

test('matching exercises have unambiguous pairs', () => {
  for (const e of allExercises.filter((e) => e.type === 'match_pairs')) {
    assert.ok(e.pairs.length >= 2, `${e.id}: too few pairs`);
    assertUnique(e.pairs.map((pair) => pair.left), `${e.id} left`);
    assertUnique(e.pairs.map((pair) => pair.right), `${e.id} right`);
  }
});

test('the main translation can be built, with wrong words to avoid', () => {
  for (const e of allExercises.filter((e) => e.type === 'translate')) {
    assert.ok(e.answers.length > 0, `${e.id}: no answers`);
    const bank = [...e.wordBank];
    for (const word of e.answers[0].split(' ')) {
      const index = bank.indexOf(word);
      assert.ok(index >= 0, `${e.id}: word bank is missing "${word}"`);
      bank.splice(index, 1);
    }
    assert.ok(bank.length > 0, `${e.id}: word bank has no wrong words`);
  }
});
