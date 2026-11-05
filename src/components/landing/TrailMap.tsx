import { useState } from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  type ViewStyle,
} from 'react-native';
import Svg, { Circle, Ellipse, G, Path, Rect, Text as SvgText } from 'react-native-svg';

import { COURSES } from '@/course/courses';
import { LEVEL_PLAN } from '@/course/levels';
import { colors, radius, spacing } from '@/theme';

import { Cloud, FinishFlag, Sparkle, Squiggle } from './Doodles';
import { MAP_THEMES, type MapTheme } from './mapThemes';

const FONT = 'system-ui, -apple-system, "Segoe UI", sans-serif';

type Waypoint = { x: number; y: number; region: number; stop?: number };
type Slot = { x: number; y: number; scale: number };

type MapLayout = {
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
  extras: { kind: 'cloud' | 'sparkle' | 'squiggle'; x: number; y: number; scale?: number; rotate?: number }[];
  flag?: { x: number; y: number };
};

// Three long rows that fit a wide screen.
const WIDE_LAYOUT: MapLayout = {
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
const TALL_LAYOUT: MapLayout = {
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
function stretchLayout(layout: MapLayout, factor: number): MapLayout {
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

function curveSegments(waypoints: Waypoint[], mirrorX: (x: number) => number) {
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

function TokenArt({
  number,
  style,
  active,
  locked,
}: {
  number: number;
  style: MapTheme['regions'][number];
  active: boolean;
  locked: boolean;
}) {
  const top = active ? '#FFF4E3' : style.token;

  return (
    <Svg width="100%" height="100%" viewBox="0 0 110 110">
      {active ? <Circle cx={55} cy={50} r={52} fill="#F7B733" opacity={0.4} /> : null}
      <Ellipse cx={55} cy={72} rx={44} ry={32} fill="#FFF4E3" stroke="#3B2318" strokeWidth={3} />
      <Ellipse cx={55} cy={64} rx={38} ry={28} fill={active ? '#F7B733' : style.rim} />
      <Ellipse cx={55} cy={54} rx={38} ry={28} fill={top} stroke="#3B2318" strokeWidth={3} />
      <Ellipse cx={42} cy={40} rx={13} ry={5} fill="#FFFFFF" opacity={active ? 0.9 : 0.25} />
      <SvgText
        x={55}
        y={number === 10 ? 66 : 68}
        fontFamily={FONT}
        fontSize={number === 10 ? 32 : 38}
        fontWeight="800"
        textAnchor="middle"
        fill={active ? '#3B2318' : '#FFFFFF'}
      >
        {number}
      </SvgText>
      {locked ? (
        <G transform="translate(88 28)">
          <Path d="M-6 -2 V-7 C-6 -15 6 -15 6 -7 V-2" fill="none" stroke="#3B2318" strokeWidth={3} />
          <Rect x={-9} y={-3} width={18} height={14} rx={3} fill="#F7B733" stroke="#3B2318" strokeWidth={2.5} />
        </G>
      ) : null}
    </Svg>
  );
}

// A CSS transition makes the lift smooth on the web and does nothing on phones.
const LIFT_TRANSITION = {
  transitionDuration: '160ms',
  transitionProperty: 'transform',
} as ViewStyle;

function MapStop({
  layout,
  x,
  y,
  number,
  style,
  available,
  startLabel,
  onStart,
}: {
  layout: MapLayout;
  x: number;
  y: number;
  number: number;
  style: MapTheme['regions'][number];
  available: boolean;
  startLabel: string;
  onStart: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [tapped, setTapped] = useState(false);
  const level = LEVEL_PLAN[number - 1];
  const status = available ? startLabel : 'Coming soon';
  const open = hovered || tapped;
  const size = layout.tokenSize;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Level ${number}: ${level.title}, ${status}`}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      onPress={() => {
        if (available) onStart();
        else setTapped(!tapped);
      }}
      style={[
        styles.stop,
        LIFT_TRANSITION,
        {
          height: `${(size / layout.height) * 100}%`,
          left: `${((x - size / 2) / layout.width) * 100}%`,
          top: `${((y - size / 2) / layout.height) * 100}%`,
          transform: open
            ? [{ translateY: -8 }, { scale: 1.1 }]
            : [{ translateY: 0 }, { scale: 1 }],
          width: `${(size / layout.width) * 100}%`,
          zIndex: open ? 5 : 2,
        },
      ]}
    >
      <TokenArt number={number} style={style} active={available} locked={!available} />

      {layout.showCaptions && !open ? (
        <View pointerEvents="none" style={styles.caption}>
          <Text numberOfLines={1} style={styles.captionText}>
            {level.title}
          </Text>
        </View>
      ) : null}

      {open ? (
        <View pointerEvents="none" style={styles.tooltip}>
          <Text style={styles.tooltipTitle}>
            Level {number}: {level.title}
          </Text>
          <Text style={styles.tooltipStatus}>{status}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

type TrailMapProps = {
  logo: number;
  startLabel: string;
  onStart: () => void;
};

export function TrailMap({ logo, startLabel, onStart }: TrailMapProps) {
  const { width, height } = useWindowDimensions();
  const [themeIndex, setThemeIndex] = useState(0);
  const theme = MAP_THEMES[themeIndex];
  const course = COURSES.find((item) => item.id === theme.courseId);
  const readyLevels = course?.units.length ?? 0;

  const isWide = width >= 800;

  // The nav, heading and language tabs take this much of the screen.
  const reserved = isWide ? 260 : 212;
  const sideMargin = isWide ? 12 : spacing.md;
  const availableWidth = width - sideMargin * 2;
  const availableHeight = Math.max(height - reserved, 300);

  const baseLayout = isWide ? WIDE_LAYOUT : TALL_LAYOUT;
  const fullWidth = (availableWidth / availableHeight) * baseLayout.height;
  const layout = isWide
    ? stretchLayout(baseLayout, Math.max(fullWidth / baseLayout.width, 1))
    : baseLayout;
  const mirrorX = (x: number) => (theme.mirror ? layout.width - x : x);

  const scale = Math.min(
    availableWidth / layout.width,
    availableHeight / layout.height,
  );
  const mapWidth = layout.width * scale;
  const mapHeight = layout.height * scale;

  const segments = curveSegments(layout.waypoints, mirrorX);
  const stops = layout.waypoints.filter((point) => point.stop !== undefined);
  const first = layout.waypoints[0];
  const mascotOffset = theme.mirror ? 10 : -10;

  return (
    <View
      style={[
        styles.section,
        {
          backgroundColor: theme.background,
          minHeight: Math.max(height, 560),
          paddingHorizontal: sideMargin,
        },
      ]}
    >
      <Text
        accessibilityRole="header"
        style={[styles.title, !isWide && styles.titleSmall]}
      >
        Your <Text style={{ color: theme.accent }}>{theme.title}</Text> journey
        starts here
      </Text>

      <View style={styles.tabs}>
        {MAP_THEMES.map((item, index) => {
          const selected = index === themeIndex;
          return (
            <Pressable
              key={item.courseId}
              accessibilityRole="button"
              accessibilityLabel={`Show the ${item.title} map`}
              accessibilityState={{ selected }}
              onPress={() => setThemeIndex(index)}
              style={[
                styles.tab,
                selected && { backgroundColor: theme.accent, borderColor: theme.accent },
              ]}
            >
              <Text style={[styles.tabText, selected && styles.tabTextSelected]}>
                {item.title}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View
        accessibilityLabel={`A winding road through the ${theme.title} world, with ${LEVEL_PLAN.length} levels.`}
        style={{ height: mapHeight, width: mapWidth }}
      >
        <Svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${layout.width} ${layout.height}`}
        >
          {layout.extras.map(({ kind, x, y, scale: size, rotate }) => {
            const props = { x: mirrorX(x), y, scale: size, rotate };
            const key = `${kind}-${x}-${y}`;
            if (kind === 'cloud') return <Cloud key={key} {...props} />;
            if (kind === 'sparkle') return <Sparkle key={key} {...props} />;
            return <Squiggle key={key} {...props} />;
          })}

          {layout.slots.map((slot, index) => {
            const Doodle = theme.doodles[index % theme.doodles.length];
            return (
              <Doodle
                key={`${theme.courseId}-${index}`}
                x={mirrorX(slot.x)}
                y={slot.y}
                scale={slot.scale}
              />
            );
          })}

          {segments.map(({ region, d }, index) => (
            <Path
              key={`side-${region}`}
              d={d}
              transform={`translate(0 ${layout.roadDepth})`}
              fill="none"
              stroke={theme.regions[region].side}
              strokeWidth={layout.roadWidth}
              strokeLinecap={
                index === 0 || index === segments.length - 1 ? 'round' : 'butt'
              }
              strokeLinejoin="round"
            />
          ))}
          {segments.map(({ region, d }, index) => (
            <Path
              key={`top-${region}`}
              d={d}
              fill="none"
              stroke={theme.regions[region].top}
              strokeWidth={layout.roadWidth}
              strokeLinecap={
                index === 0 || index === segments.length - 1 ? 'round' : 'butt'
              }
              strokeLinejoin="round"
            />
          ))}
          {segments.map(({ region, d }) => (
            <Path
              key={`dash-${region}`}
              d={d}
              fill="none"
              stroke="#FFF4E3"
              strokeWidth={4}
              strokeLinecap="round"
              strokeDasharray="3 18"
              opacity={0.85}
            />
          ))}

          {layout.flag ? (
            <FinishFlag x={mirrorX(layout.flag.x)} y={layout.flag.y} scale={0.75} />
          ) : null}

          {layout.banners.map(({ x, y }, index) => {
            const { name, token } = theme.regions[index];
            const bannerWidth = name.length * 14 + 40;
            const cx = mirrorX(x);
            return (
              <G key={name}>
                <Rect
                  x={cx - bannerWidth / 2}
                  y={y - 20}
                  width={bannerWidth}
                  height={40}
                  rx={20}
                  fill={token}
                  stroke="#3B2318"
                  strokeWidth={2.5}
                />
                <SvgText
                  x={cx}
                  y={y + 8}
                  fontFamily={FONT}
                  fontSize={23}
                  fontWeight="800"
                  textAnchor="middle"
                  fill="#FFFFFF"
                >
                  {name}
                </SvgText>
              </G>
            );
          })}
        </Svg>

        {stops.map(({ x, y, region, stop = 0 }) => (
          <MapStop
            key={`${theme.courseId}-${stop}`}
            layout={layout}
            x={mirrorX(x)}
            y={y}
            number={stop}
            style={theme.regions[region]}
            available={stop <= readyLevels}
            startLabel={startLabel}
            onStart={onStart}
          />
        ))}

        <View
          pointerEvents="none"
          style={[
            styles.mascot,
            {
              height: `${((layout.mascotSize * (690 / 732)) / layout.height) * 100}%`,
              left: `${((mirrorX(first.x) - layout.mascotSize / 2 + mascotOffset) / layout.width) * 100}%`,
              top: `${((first.y - layout.tokenSize / 2 - layout.mascotSize * 0.82) / layout.height) * 100}%`,
              width: `${(layout.mascotSize / layout.width) * 100}%`,
            },
          ]}
        >
          <Image
            accessibilityLabel={`Viso the red panda, at the start of the ${theme.title} road`}
            source={logo}
            resizeMode="contain"
            style={styles.mascotImage}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    alignItems: 'center',
    gap: spacing.sm,
    justifyContent: 'center',
    overflow: 'hidden',
    paddingBottom: spacing.md,
    paddingTop: 88,
    width: '100%',
  },
  title: {
    color: colors.brown,
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -0.5,
    lineHeight: 42,
    textAlign: 'center',
  },
  titleSmall: {
    fontSize: 24,
    lineHeight: 30,
  },
  tabs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    justifyContent: 'center',
  },
  tab: {
    backgroundColor: colors.white,
    borderColor: colors.brown,
    borderRadius: radius.pill,
    borderWidth: 2,
    justifyContent: 'center',
    minHeight: 36,
    paddingHorizontal: spacing.md,
  },
  tabText: {
    color: colors.brown,
    fontSize: 14,
    fontWeight: '700',
  },
  tabTextSelected: {
    color: colors.white,
  },
  stop: {
    position: 'absolute',
  },
  caption: {
    alignItems: 'center',
    left: -40,
    position: 'absolute',
    right: -40,
    top: '94%',
  },
  captionText: {
    backgroundColor: colors.white,
    borderColor: colors.brown,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    color: colors.brown,
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: spacing.sm,
    paddingVertical: 1,
  },
  tooltip: {
    alignSelf: 'center',
    backgroundColor: colors.ink,
    borderRadius: radius.md,
    bottom: '96%',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    position: 'absolute',
    width: 170,
  },
  tooltipTitle: {
    color: colors.sand,
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
  },
  tooltipStatus: {
    color: colors.sandMuted,
    fontSize: 12,
    textAlign: 'center',
  },
  mascot: {
    position: 'absolute',
    zIndex: 3,
  },
  mascotImage: {
    height: '100%',
    width: '100%',
  },
});
