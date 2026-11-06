import assert from 'node:assert/strict';
import { test } from 'node:test';

import { friendlyAuthError, safeNextPath } from './authHelpers.ts';

test('returns to pages inside Biso', () => {
  assert.equal(safeNextPath('/lesson/fr-basics-1'), '/lesson/fr-basics-1');
  assert.equal(safeNextPath('/practice'), '/practice');
});

test('never returns to an outside address', () => {
  for (const bad of [
    'https://evil.example',
    '//evil.example',
    '/\\evil.example',
    'javascript:alert(1)',
    '',
    undefined,
    null,
    ['/learn'],
  ]) {
    assert.equal(safeNextPath(bad), '/learn', String(bad));
  }
});

test('explains sign-in problems in plain words', () => {
  assert.match(friendlyAuthError({ code: 'auth/weak-password' }), /6 characters/);
  assert.match(friendlyAuthError({ code: 'auth/email-already-in-use' }), /already has an account/);
});

test('wrong email and wrong password look the same', () => {
  const wrongPassword = friendlyAuthError({ code: 'auth/wrong-password' });
  assert.equal(friendlyAuthError({ code: 'auth/user-not-found' }), wrongPassword);
  assert.equal(friendlyAuthError({ code: 'auth/invalid-credential' }), wrongPassword);
});

test('closing the Google window is not treated as an error', () => {
  assert.equal(friendlyAuthError({ code: 'auth/popup-closed-by-user' }), null);
  assert.equal(friendlyAuthError({ code: 'auth/cancelled-popup-request' }), null);
});

test('unknown problems still get a message', () => {
  for (const unknown of [{ code: 'auth/new-thing' }, new Error('x'), null, undefined]) {
    assert.match(friendlyAuthError(unknown), /try again/);
  }
});
