import Svg, { Circle, Ellipse, Path } from 'react-native-svg';

/** Hand-drawn pieces of Biso, matched to the logo, that can overlap a card. */
const FUR = '#3E2116';
const OUTLINE = '#2A150C';
const PAD = '#6B4231';

/** A paw gripping over an edge, with the arm going up behind it. */
export function GripPaw({ size = 44 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 44 44">
      <Path
        d="M8 4 C8 0 36 0 36 4 L38 26 C38 38 6 38 6 26 Z"
        fill={FUR}
        stroke={OUTLINE}
        strokeWidth={2}
      />
      <Circle cx={13} cy={32} r={6} fill={FUR} stroke={OUTLINE} strokeWidth={2} />
      <Circle cx={22} cy={35} r={6} fill={FUR} stroke={OUTLINE} strokeWidth={2} />
      <Circle cx={31} cy={32} r={6} fill={FUR} stroke={OUTLINE} strokeWidth={2} />
      <Ellipse cx={13} cy={33} rx={2.5} ry={2} fill={PAD} />
      <Ellipse cx={22} cy={36} rx={2.5} ry={2} fill={PAD} />
      <Ellipse cx={31} cy={33} rx={2.5} ry={2} fill={PAD} />
    </Svg>
  );
}

/** Biso's striped tail, to peek out from behind a card. */
export function Tail({ size = 90 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 90 90">
      <Path
        d="M8 78 C2 44 22 8 54 8 C78 8 88 28 80 44 C72 60 50 54 44 64 C40 72 40 80 36 86 Z"
        fill="#C9531C"
        stroke="#7A2D0C"
        strokeWidth={2.5}
      />
      <Path d="M24 26 C34 32 42 42 44 62 L34 74 C34 54 26 42 13 38 Z" fill="#FBE7C6" />
      <Path d="M52 8 C60 18 66 30 64 50 L78 44 C84 30 76 12 60 8 Z" fill="#FBE7C6" />
    </Svg>
  );
}

/** Two legs hanging down, for when Biso sits on an edge. */
export function DanglingLegs({ width = 90 }: { width?: number }) {
  return (
    <Svg width={width} height={width * 0.62} viewBox="0 0 90 56">
      <Path
        d="M12 0 H36 L35 34 C35 42 34 50 26 52 C14 54 8 48 11 40 Z"
        fill={FUR}
        stroke={OUTLINE}
        strokeWidth={2}
      />
      <Path
        d="M54 0 H78 L79 40 C82 48 76 54 64 52 C56 50 55 42 55 34 Z"
        fill={FUR}
        stroke={OUTLINE}
        strokeWidth={2}
      />
      <Ellipse cx={22} cy={45} rx={7} ry={4.5} fill={PAD} />
      <Ellipse cx={68} cy={45} rx={7} ry={4.5} fill={PAD} />
    </Svg>
  );
}
