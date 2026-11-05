export type Waypoint = { x: number; y: number; region: number; stop?: number };
export type Slot = { x: number; y: number; scale: number };

export type MapLayout = {
  width: number;
  height: number;
  roadWidth: number;
  roadDepth: number;
  tokenSize: number;
  mascotSize: number;
  showCaptions: boolean;
  waypoints: Waypoint[];
  banners: { x: number; y: number }[];
  slots: Slot[];
  extras: {
    kind: 'cloud' | 'sparkle' | 'squiggle';
    x: number;
    y: number;
    scale?: number;
    rotate?: number;
  }[];
  flag?: { x: number; y: number };
};

// Three long rows that fit a wide screen.
export const WIDE_LAYOUT: MapLayout = {
  width: 1200,
  height: 590,
  roadWidth: 54,
  roadDepth: 14,
  tokenSize: 92,
  mascotSize: 96,
  showCaptions: true,
  waypoints: [
    { x: 90, y: 125, region: 0, stop: 1 },
    { x: 340, y: 105, region: 0, stop: 2 },
    { x: 590, y: 135, region: 1, stop: 3 },
    { x: 840, y: 105, region: 1, stop: 4 },
    { x: 1050, y: 120, region: 1 },
    { x: 1135, y: 205, region: 1 },
    { x: 1040, y: 290, region: 1 },
    { x: 850, y: 305, region: 2, stop: 5 },
    { x: 590, y: 280, region: 2, stop: 6 },
    { x: 340, y: 305, region: 3, stop: 7 },
    { x: 150, y: 325, region: 3 },
    { x: 65, y: 410, region: 3 },
    { x: 150, y: 490, region: 3 },
    { x: 340, y: 500, region: 3, stop: 8 },
    { x: 600, y: 475, region: 4, stop: 9 },
    { x: 860, y: 500, region: 4, stop: 10 },
    { x: 1100, y: 480, region: 4 },
  ],
  banners: [
    { x: 215, y: 34 },
    { x: 715, y: 34 },
    { x: 720, y: 205 },
    { x: 330, y: 400 },
    { x: 730, y: 400 },
  ],
  slots: [
    { x: 120, y: 240, scale: 0.65 },
    { x: 440, y: 205, scale: 0.65 },
    { x: 980, y: 205, scale: 0.65 },
    { x: 520, y: 405, scale: 0.6 },
    { x: 980, y: 395, scale: 0.65 },
    { x: 1135, y: 355, scale: 0.6 },
    { x: 1000, y: 40, scale: 0.55 },
    { x: 1130, y: 40, scale: 0.5 },
  ],
  extras: [
    { kind: 'cloud', x: 480, y: 38, scale: 0.75 },
    { kind: 'sparkle', x: 880, y: 210, scale: 0.8 },
    { kind: 'sparkle', x: 230, y: 245, scale: 0.8 },
    { kind: 'sparkle', x: 145, y: 400, scale: 0.7 },
    { kind: 'squiggle', x: 240, y: 555, scale: 0.8 },
    { kind: 'squiggle', x: 620, y: 555, scale: 0.8 },
  ],
  flag: { x: 1110, y: 478 },
};

// Five short rows that fit a phone.
export const TALL_LAYOUT: MapLayout = {
  width: 560,
  height: 860,
  roadWidth: 50,
  roadDepth: 13,
  tokenSize: 92,
  mascotSize: 92,
  showCaptions: false,
  waypoints: [
    { x: 85, y: 110, region: 0, stop: 1 },
    { x: 285, y: 95, region: 0, stop: 2 },
    { x: 465, y: 130, region: 1 },
    { x: 490, y: 215, region: 1 },
    { x: 340, y: 262, region: 1, stop: 3 },
    { x: 140, y: 268, region: 1, stop: 4 },
    { x: 55, y: 345, region: 1 },
    { x: 130, y: 425, region: 2 },
    { x: 290, y: 430, region: 2, stop: 5 },
    { x: 465, y: 440, region: 2, stop: 6 },
    { x: 510, y: 520, region: 2 },
    { x: 420, y: 595, region: 3 },
    { x: 260, y: 600, region: 3, stop: 7 },
    { x: 100, y: 620, region: 3, stop: 8 },
    { x: 55, y: 700, region: 3 },
    { x: 130, y: 780, region: 4 },
    { x: 290, y: 790, region: 4, stop: 9 },
    { x: 480, y: 785, region: 4, stop: 10 },
  ],
  banners: [
    { x: 330, y: 32 },
    { x: 235, y: 180 },
    { x: 310, y: 350 },
    { x: 270, y: 515 },
    { x: 300, y: 700 },
  ],
  slots: [
    { x: 470, y: 45, scale: 0.5 },
    { x: 80, y: 195, scale: 0.5 },
    { x: 480, y: 340, scale: 0.5 },
    { x: 90, y: 505, scale: 0.5 },
    { x: 470, y: 680, scale: 0.5 },
  ],
  extras: [],
};

/** Spreads a layout sideways so the road runs from one screen edge to the other. */
export function stretchLayout(layout: MapLayout, factor: number): MapLayout {
  const spread = <T extends { x: number }>(item: T): T => ({
    ...item,
    x: item.x * factor,
  });

  return {
    ...layout,
    width: layout.width * factor,
    waypoints: layout.waypoints.map(spread),
    banners: layout.banners.map(spread),
    slots: layout.slots.map(spread),
    extras: layout.extras.map(spread),
    flag: layout.flag ? spread(layout.flag) : undefined,
  };
}

/** Chooses evenly spaced places on the road for `count` stops, first to last. */
export function pickStopPoints(layout: MapLayout, count: number): Waypoint[] {
  const points = layout.waypoints.filter((point) => point.stop !== undefined);
  if (count <= 0) return [];
  if (count === 1) return [points[0]];
  const used = Math.min(count, points.length);

  return Array.from(
    { length: used },
    (_, index) => points[Math.round((index * (points.length - 1)) / (used - 1))],
  );
}

export function curveSegments(
  waypoints: Waypoint[],
  mirrorX: (x: number) => number,
): { region: number; d: string }[] {
  const at = (i: number) =>
    waypoints[Math.min(Math.max(i, 0), waypoints.length - 1)];
  const segments: { region: number; points: { x: number; y: number }[] }[] = [];

  for (let i = 0; i < waypoints.length - 1; i++) {
    const [p0, p1, p2, p3] = [at(i - 1), at(i), at(i + 1), at(i + 2)];
    const points: { x: number; y: number }[] = [];
    for (let step = 0; step <= 12; step++) {
      const t = step / 12;
      const t2 = t * t;
      const t3 = t2 * t;
      const blend = (a: number, b: number, c: number, d: number) =>
        0.5 *
        (2 * b +
          (c - a) * t +
          (2 * a - 5 * b + 4 * c - d) * t2 +
          (3 * b - a - 3 * c + d) * t3);
      points.push({
        x: mirrorX(blend(p0.x, p1.x, p2.x, p3.x)),
        y: blend(p0.y, p1.y, p2.y, p3.y),
      });
    }

    const last = segments[segments.length - 1];
    if (last && last.region === p1.region) last.points.push(...points);
    else segments.push({ region: p1.region, points });
  }

  return segments.map(({ region, points }) => ({
    region,
    d: points
      .map(({ x, y }, i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`)
      .join(' '),
  }));
}
