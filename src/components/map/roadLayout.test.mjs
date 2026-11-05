import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  TALL_LAYOUT,
  WIDE_LAYOUT,
  curveSegments,
  pickStopPoints,
  stretchLayout,
} from './roadLayout.ts';

for (const [name, layout] of [
  ['wide', WIDE_LAYOUT],
  ['tall', TALL_LAYOUT],
]) {
  test(`${name}: has 10 stops in order and everything fits on the map`, () => {
    const stops = layout.waypoints.filter((point) => point.stop !== undefined);
    assert.deepEqual(stops.map((point) => point.stop), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    for (const { x, y } of layout.waypoints) {
      assert.ok(x > 0 && x < layout.width, `x ${x} is off the map`);
      assert.ok(y > 0 && y < layout.height, `y ${y} is off the map`);
    }
  });

  test(`${name}: places any number of stops without repeats, first to last`, () => {
    const all = layout.waypoints.filter((point) => point.stop !== undefined);
    for (let count = 2; count <= 10; count++) {
      const points = pickStopPoints(layout, count);
      assert.equal(points.length, count);
      assert.equal(new Set(points).size, count, `repeats with ${count} stops`);
      assert.equal(points[0], all[0]);
      assert.equal(points[count - 1], all[9]);
    }
  });
}

test('there is nowhere to put zero stops, and one stop goes first', () => {
  assert.deepEqual(pickStopPoints(WIDE_LAYOUT, 0), []);
  assert.equal(pickStopPoints(WIDE_LAYOUT, 1)[0].stop, 1);
});

test('more stops than places are capped, not repeated', () => {
  assert.equal(pickStopPoints(WIDE_LAYOUT, 14).length, 10);
});

test('stretching only spreads things sideways', () => {
  const wider = stretchLayout(WIDE_LAYOUT, 1.5);
  assert.equal(wider.width, WIDE_LAYOUT.width * 1.5);
  assert.equal(wider.height, WIDE_LAYOUT.height);
  assert.equal(wider.waypoints[1].x, WIDE_LAYOUT.waypoints[1].x * 1.5);
  assert.equal(wider.waypoints[1].y, WIDE_LAYOUT.waypoints[1].y);
});

test('the road has one continuous piece per region, in order', () => {
  const segments = curveSegments(WIDE_LAYOUT.waypoints, (x) => x);
  assert.deepEqual(segments.map((segment) => segment.region), [0, 1, 2, 3, 4]);
});

test('mirroring flips the road left to right', () => {
  const width = WIDE_LAYOUT.width;
  const [plain] = curveSegments(WIDE_LAYOUT.waypoints, (x) => x);
  const [mirrored] = curveSegments(WIDE_LAYOUT.waypoints, (x) => width - x);
  const firstX = (d) => Number(d.slice(1).split(' ')[0]);
  assert.equal(firstX(mirrored.d), width - firstX(plain.d));
});
