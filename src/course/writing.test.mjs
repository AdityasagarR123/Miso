import assert from 'node:assert/strict';
import { test } from 'node:test';

import { isWritingCorrect } from './writing.ts';

test('forgives capitals, punctuation, spaces and accents', () => {
  assert.ok(isWritingCorrect('adios', ['Adiós']));
  assert.ok(isWritingCorrect('  COMO   ESTAS ', ['¿Cómo estás?']));
  assert.ok(isWritingCorrect('sil vous plait', ["S'il vous plaît"]));
  assert.ok(isWritingCorrect('muito obrigado!', ['Muito obrigado']));
});

test('accepts the script or the pronunciation guide', () => {
  const answers = ['こんにちは', 'konnichiwa'];
  assert.ok(isWritingCorrect('こんにちは', answers));
  assert.ok(isWritingCorrect('Konnichiwa', answers));
  assert.ok(isWritingCorrect('ni hao', ['你好', 'nǐ hǎo']));
  assert.ok(isWritingCorrect('marhaban', ['مرحبا', 'marḥaban']));
  assert.ok(isWritingCorrect('naam', ['نعم', 'naʿam']));
  assert.ok(isWritingCorrect('nihao', ['你好', 'nǐ hǎo']));
  assert.ok(isWritingCorrect('strasse', ['Straße']));
});

test('marks that change a letter in other scripts still count', () => {
  assert.equal(isWritingCorrect('かく', ['がく']), false);
  assert.equal(isWritingCorrect('कतन', ['कितना']), false);
  assert.ok(isWritingCorrect('कितना', ['कितना']));
});

test('rejects wrong and empty answers', () => {
  assert.equal(isWritingCorrect('hola', ['Adiós']), false);
  assert.equal(isWritingCorrect('', ['Adiós']), false);
  assert.equal(isWritingCorrect('   ', ['Adiós']), false);
  assert.equal(isWritingCorrect('?!', ['Adiós']), false);
});
