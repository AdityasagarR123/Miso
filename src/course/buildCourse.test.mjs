import assert from 'node:assert/strict';
import { test } from 'node:test';

import { buildUnits } from './buildCourse.ts';
import { LEVEL_PLAN } from './levels.ts';
import { PHRASEBOOK } from './phrasebook.ts';

const LANGUAGES = {
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  it: 'Italian',
  pt: 'Portuguese',
  ja: 'Japanese',
  ko: 'Korean',
  zh: 'Mandarin Chinese',
  hi: 'Hindi',
  ar: 'Arabic',
};

test('the phrasebook fills all 10 levels, with every language filled in', () => {
  assert.equal(PHRASEBOOK.length, 80);
  const english = PHRASEBOOK.map((phrase) => phrase.en);
  assert.equal(new Set(english).size, 80, 'an English phrase is repeated');

  for (const phrase of PHRASEBOOK) {
    for (const language of Object.keys(LANGUAGES)) {
      const value = phrase[language];
      const parts = typeof value === 'string' ? [value] : value;
      for (const part of parts) {
        assert.ok(part && part.trim(), `${phrase.en} is empty in ${language}`);
      }
    }
  }
});

for (const [language, title] of Object.entries(LANGUAGES)) {
  const units = buildUnits(LEVEL_PLAN, PHRASEBOOK, language, title);
  const lessons = units.flatMap((unit) => unit.lessons);
  const exercises = lessons.flatMap((lesson) => lesson.exercises);

  test(`${title}: has 10 levels of playable lessons with unique ids`, () => {
    assert.equal(units.length, 10);
    assert.deepEqual(units.map((u) => u.id), LEVEL_PLAN.map((l) => l.id));
    assert.equal(lessons.length, 20);
    assert.equal(new Set(lessons.map((l) => l.id)).size, 20);
    assert.equal(exercises.length, 120);
    assert.equal(new Set(exercises.map((e) => e.id)).size, 120);
  });

  test(`${title}: every multiple choice has distinct choices with the answer`, () => {
    for (const e of exercises.filter((x) => x.type === 'multiple_choice')) {
      assert.equal(e.choices.length, 3, `${e.id}: needs 3 choices`);
      assert.equal(new Set(e.choices).size, 3, `${e.id}: repeated choices`);
      assert.ok(e.choices.includes(e.answer), `${e.id}: answer missing`);
    }
  });

  test(`${title}: every matching exercise is unambiguous`, () => {
    for (const e of exercises.filter((x) => x.type === 'match_pairs')) {
      assert.equal(e.pairs.length, 4, e.id);
      assert.equal(new Set(e.pairs.map((p) => p.left)).size, 4, `${e.id}: left`);
      assert.equal(new Set(e.pairs.map((p) => p.right)).size, 4, `${e.id}: right`);
    }
  });

  test(`${title}: every translation can be built, with wrong words to avoid`, () => {
    for (const e of exercises.filter((x) => x.type === 'translate')) {
      const bank = [...e.wordBank];
      for (const word of e.answers[0].split(' ')) {
        const index = bank.indexOf(word);
        assert.ok(index >= 0, `${e.id}: missing "${word}"`);
        bank.splice(index, 1);
      }
      assert.ok(bank.length > 0, `${e.id}: no wrong words`);
    }
  });
}

test('scripts a beginner cannot read yet show how to say them', () => {
  for (const [language, title] of [
    ['ja', 'Japanese'],
    ['ko', 'Korean'],
    ['zh', 'Mandarin Chinese'],
    ['hi', 'Hindi'],
    ['ar', 'Arabic'],
  ]) {
    const [first] = buildUnits(LEVEL_PLAN, PHRASEBOOK, language, title);
    const pair = first.lessons[0].exercises[2].pairs[0];
    assert.match(pair.left, /\(.+\)$/, `${title} has no pronunciation guide`);
  }
});
