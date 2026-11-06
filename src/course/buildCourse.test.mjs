import assert from 'node:assert/strict';
import { test } from 'node:test';

import { buildUnits } from './buildCourse.ts';
import { GRAMMAR } from './grammar.ts';
import { LEVEL_PLAN } from './levels.ts';
import { PHRASEBOOK } from './phrasebook.ts';
import { isWritingCorrect } from './writing.ts';

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
  const units = buildUnits(LEVEL_PLAN, PHRASEBOOK, language, title, GRAMMAR[language]);
  const lessons = units.flatMap((unit) => unit.lessons);
  const exercises = lessons.flatMap((lesson) => lesson.exercises);

  test(`${title}: has 10 levels of playable lessons with unique ids`, () => {
    assert.equal(units.length, 10);
    assert.deepEqual(units.map((u) => u.id), LEVEL_PLAN.map((l) => l.id));
    assert.equal(lessons.length, 40);
    assert.equal(new Set(lessons.map((l) => l.id)).size, 40);
    assert.equal(new Set(exercises.map((e) => e.id)).size, exercises.length);
  });

  test(`${title}: every level has words, grammar and writing lessons`, () => {
    for (const unit of units) {
      assert.deepEqual(
        unit.lessons.map((l) => l.title),
        ['Words 1', 'Words 2', 'Grammar', 'Writing'],
      );
    }
  });

  test(`${title}: has 20 distinct grammar questions, reused only as review`, () => {
    assert.equal(GRAMMAR[language].length, 20);
    assert.equal(new Set(GRAMMAR[language].map(([q]) => q)).size, 20);
    const grammar = units.map((unit) => unit.lessons[2].exercises);
    assert.deepEqual(grammar.map((items) => items.length), [2, 4, 5, 5, 5, 5, 5, 5, 5, 5]);
    grammar.forEach((items, levelIndex) => {
      assert.deepEqual(
        items.slice(0, 2).map((e) => e.prompt),
        GRAMMAR[language].slice(levelIndex * 2, levelIndex * 2 + 2).map(([q]) => q),
      );
    });
  });

  test(`${title}: every writing exercise can be answered as shown`, () => {
    for (const unit of units) {
      const writing = unit.lessons[3].exercises;
      assert.equal(writing.length, 6);
      for (const e of writing) {
        assert.equal(e.type, 'write');
        assert.ok(e.answers.length > 0, `${e.id}: no answers`);
        for (const answer of e.answers) {
          assert.ok(isWritingCorrect(answer, e.answers), `${e.id}: "${answer}"`);
        }
      }
    }
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
    const [first] = buildUnits(LEVEL_PLAN, PHRASEBOOK, language, title, GRAMMAR[language]);
    const pair = first.lessons[0].exercises[2].pairs[0];
    assert.match(pair.left, /\(.+\)$/, `${title} has no pronunciation guide`);
  }
});
