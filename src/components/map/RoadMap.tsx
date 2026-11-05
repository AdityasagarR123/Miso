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

import { colors, radius, spacing } from '@/theme';

import { Cloud, FinishFlag, Sparkle, Squiggle } from './Doodles';
import type { MapTheme, RegionStyle } from './mapThemes';
import {
  curveSegments,
  pickStopPoints,
  stretchLayout,
  TALL_LAYOUT,
  WIDE_LAYOUT,
  type MapLayout,
} from './roadLayout';

const LOGO_FULL = require('../../../assets/brand/viso-full.png');
const FONT = 'system-ui, -apple-system, "Segoe UI", sans-serif';

export type StopStatus = 'done' | 'open' | 'locked';

export type RoadStop = {
  key: string;
  number: number;
  caption: string;
  tooltipTitle: string;
  tooltipStatus: string;
  status: StopStatus;
  onPress?: () => void;
};

function TokenArt({
  number,
  style,
  status,
}: {
  number: number;
  style: RegionStyle;
  status: StopStatus;
}) {
  const open = status === 'open';
  const done = status === 'done';

  return (
    <Svg width="100%" height="100%" viewBox="0 0 110 110">
      {open ? <Circle cx={55} cy={50} r={52} fill="#F7B733" opacity={0.4} /> : null}
      <Ellipse cx={55} cy={72} rx={44} ry={32} fill="#FFF4E3" stroke="#3B2318" strokeWidth={3} />
      <Ellipse cx={55} cy={64} rx={38} ry={28} fill={open || done ? '#F7B733' : style.rim} />
      <Ellipse cx={55} cy={54} rx={38} ry={28} fill={open ? '#FFF4E3' : style.token} stroke="#3B2318" strokeWidth={3} />
      <Ellipse cx={42} cy={40} rx={13} ry={5} fill="#FFFFFF" opacity={open ? 0.9 : 0.25} />
      {done ? (
        <Path
          d="M38 55 L51 67 L74 41"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth={9}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <SvgText
          x={55}
          y={number >= 10 ? 66 : 68}
          fontFamily={FONT}
          fontSize={number >= 10 ? 32 : 38}
          fontWeight="800"
          textAnchor="middle"
          fill={open ? '#3B2318' : '#FFFFFF'}
        >
          {number}
        </SvgText>
      )}
      {status === 'locked' ? (
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

function Stop({
  stop,
  layout,
  x,
  y,
  style,
}: {
  stop: RoadStop;
  layout: MapLayout;
  x: number;
  y: number;
  style: RegionStyle;
}) {
  const [hovered, setHovered] = useState(false);
  const [tapped, setTapped] = useState(false);
  const open = hovered || tapped;
  const size = layout.tokenSize;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${stop.tooltipTitle}, ${stop.tooltipStatus}`}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      onPress={() => {
        if (stop.onPress) stop.onPress();
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
      <TokenArt number={stop.number} style={style} status={stop.status} />

      {layout.showCaptions && !open ? (
        <View pointerEvents="none" style={styles.caption}>
          <Text numberOfLines={1} style={styles.captionText}>
            {stop.caption}
          </Text>
        </View>
      ) : null}

      {open ? (
        <View pointerEvents="none" style={styles.tooltip}>
          <Text style={styles.tooltipTitle}>{stop.tooltipTitle}</Text>
          <Text style={styles.tooltipStatus}>{stop.tooltipStatus}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

type RoadMapProps = {
  theme: MapTheme;
  stops: RoadStop[];
  /** Which stop Viso stands at. */
  markerIndex: number;
  /** Screen height used by everything else on the page. */
  reservedHeight: number;
  showBanners?: boolean;
};

export function RoadMap({
  theme,
  stops,
  markerIndex,
  reservedHeight,
  showBanners = true,
}: RoadMapProps) {
  const { width, height } = useWindowDimensions();
  const isWide = width >= 800;

  const sideMargin = isWide ? 12 : spacing.md;
  const availableWidth = width - sideMargin * 2;
  const availableHeight = Math.max(height - reservedHeight, 300);

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
  const segments = curveSegments(layout.waypoints, mirrorX);
  const points = pickStopPoints(layout, stops.length);
  const marker = points[Math.min(markerIndex, points.length - 1)];
  const mascotOffset = theme.mirror ? 10 : -10;

  return (
    <View style={{ height: layout.height * scale, width: layout.width * scale }}>
      <Svg width="100%" height="100%" viewBox={`0 0 ${layout.width} ${layout.height}`}>
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
            strokeLinecap={index === 0 || index === segments.length - 1 ? 'round' : 'butt'}
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
            strokeLinecap={index === 0 || index === segments.length - 1 ? 'round' : 'butt'}
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

        {showBanners
          ? layout.banners.map(({ x, y }, index) => {
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
            })
          : null}
      </Svg>

      {stops.slice(0, points.length).map((stop, index) => (
        <Stop
          key={stop.key}
          stop={stop}
          layout={layout}
          x={mirrorX(points[index].x)}
          y={points[index].y}
          style={theme.regions[points[index].region]}
        />
      ))}

      {marker ? (
        <View
          pointerEvents="none"
          style={[
            styles.mascot,
            {
              height: `${((layout.mascotSize * (690 / 732)) / layout.height) * 100}%`,
              left: `${((mirrorX(marker.x) - layout.mascotSize / 2 + mascotOffset) / layout.width) * 100}%`,
              top: `${((marker.y - layout.tokenSize / 2 - layout.mascotSize * 0.82) / layout.height) * 100}%`,
              width: `${(layout.mascotSize / layout.width) * 100}%`,
            },
          ]}
        >
          <Image
            accessibilityLabel="Viso the red panda, standing at your place on the road"
            source={LOGO_FULL}
            resizeMode="contain"
            style={styles.mascotImage}
          />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
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
