import { Circle, Ellipse, G, Line, Path, Rect } from 'react-native-svg';

/**
 * Hand-drawn style art for the landing page. Each piece is drawn around (0, 0)
 * and placed with x, y and scale, inside an Svg. `line` sets the outline color,
 * so the same art works on the dark hero and on the cream map.
 */
export type DoodleProps = {
  x: number;
  y: number;
  scale?: number;
  rotate?: number;
  line?: string;
};

const INK = '#3B2318';

function place({ x, y, scale = 1, rotate = 0 }: DoodleProps) {
  return `translate(${x} ${y}) rotate(${rotate}) scale(${scale})`;
}

export function Sparkle({ line = INK, fill = '#F7B733', ...rest }: DoodleProps & { fill?: string }) {
  return (
    <G transform={place(rest)}>
      <Path
        d="M0 -16 C2 -5 5 -2 16 0 C5 2 2 5 0 16 C-2 5 -5 2 -16 0 C-5 -2 -2 -5 0 -16 Z"
        fill={fill}
        stroke={line}
        strokeWidth={2.5}
        strokeLinejoin="round"
      />
    </G>
  );
}

export function Cloud({ line = INK, fill = 'none', ...rest }: DoodleProps & { fill?: string }) {
  return (
    <G transform={place(rest)}>
      <Path
        d="M-48 14 C-62 14 -62 -6 -46 -6 C-46 -22 -22 -24 -16 -12 C-10 -30 20 -28 22 -8 C38 -14 50 2 38 14 Z"
        fill={fill}
        stroke={line}
        strokeWidth={3}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </G>
  );
}

export function Squiggle({ line = INK, ...rest }: DoodleProps) {
  return (
    <G transform={place(rest)}>
      <Path
        d="M-50 20 C-30 -24 -14 40 4 2 C16 -22 28 10 44 -10"
        fill="none"
        stroke={line}
        strokeWidth={3}
        strokeLinecap="round"
        strokeDasharray="2 10"
      />
      <Path
        d="M34 -16 L46 -11 L42 3"
        fill="none"
        stroke={line}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </G>
  );
}

export function Bamboo({ line = INK, ...rest }: DoodleProps) {
  const stalk = (x: number, height: number, key: string) => (
    <G key={key}>
      <Rect
        x={x - 8}
        y={-height}
        width={16}
        height={height}
        rx={6}
        fill="#7CB65C"
        stroke={line}
        strokeWidth={3}
      />
      {[0.25, 0.5, 0.75].map((part) => (
        <Line
          key={part}
          x1={x - 8}
          x2={x + 8}
          y1={-height * part}
          y2={-height * part}
          stroke={line}
          strokeWidth={3}
        />
      ))}
      <Path
        d={`M${x + 8} ${-height * 0.75} C${x + 30} ${-height * 0.85} ${x + 40} ${-height * 0.75} ${x + 44} ${-height * 0.66} C${x + 30} ${-height * 0.64} ${x + 18} ${-height * 0.66} ${x + 8} ${-height * 0.75} Z`}
        fill="#A6D36B"
        stroke={line}
        strokeWidth={2.5}
        strokeLinejoin="round"
      />
      <Path
        d={`M${x - 8} ${-height * 0.5} C${x - 30} ${-height * 0.6} ${x - 40} ${-height * 0.5} ${x - 44} ${-height * 0.41} C${x - 30} ${-height * 0.39} ${x - 18} ${-height * 0.41} ${x - 8} ${-height * 0.5} Z`}
        fill="#A6D36B"
        stroke={line}
        strokeWidth={2.5}
        strokeLinejoin="round"
      />
    </G>
  );

  return (
    <G transform={place(rest)}>
      {stalk(-14, 130, 'a')}
      {stalk(16, 96, 'b')}
    </G>
  );
}

export function Lantern({ line = INK, ...rest }: DoodleProps) {
  return (
    <G transform={place(rest)}>
      <Line x1={0} x2={0} y1={-46} y2={-30} stroke={line} strokeWidth={3} />
      <Ellipse cx={0} cy={0} rx={28} ry={30} fill="#E5533D" stroke={line} strokeWidth={3} />
      <Path d="M-11 -28 C-20 -10 -20 10 -11 28 M11 -28 C20 -10 20 10 11 28" fill="none" stroke={line} strokeWidth={2.5} />
      <Rect x={-14} y={-34} width={28} height={8} rx={3} fill="#F7B733" stroke={line} strokeWidth={2.5} />
      <Rect x={-14} y={26} width={28} height={8} rx={3} fill="#F7B733" stroke={line} strokeWidth={2.5} />
      <Path d="M-5 34 L-7 50 M0 34 L0 54 M5 34 L7 50" stroke={line} strokeWidth={2.5} strokeLinecap="round" />
    </G>
  );
}

export function MarketStall({ line = INK, ...rest }: DoodleProps) {
  return (
    <G transform={place(rest)}>
      <Line x1={-46} x2={-46} y1={-18} y2={42} stroke={line} strokeWidth={4} />
      <Line x1={46} x2={46} y1={-18} y2={42} stroke={line} strokeWidth={4} />
      <Rect x={-52} y={12} width={104} height={32} rx={3} fill="#D59A5B" stroke={line} strokeWidth={3} />
      <Line x1={-52} x2={52} y1={24} y2={24} stroke={line} strokeWidth={2} />
      <Path d="M-58 -18 L-46 -48 L46 -48 L58 -18 Z" fill="#FFF4E3" stroke={line} strokeWidth={3} strokeLinejoin="round" />
      <Path d="M-40 -48 L-44 -18 L-20 -18 L-16 -48 Z M0 -48 L0 -18 L24 -18 L18 -48 Z" fill="#E0662B" stroke={line} strokeWidth={2} />
      <Circle cx={-24} cy={5} r={9} fill="#E5533D" stroke={line} strokeWidth={2.5} />
      <Circle cx={0} cy={5} r={9} fill="#F7B733" stroke={line} strokeWidth={2.5} />
      <Circle cx={24} cy={5} r={9} fill="#7CB65C" stroke={line} strokeWidth={2.5} />
    </G>
  );
}

export function Boat({ line = INK, ...rest }: DoodleProps) {
  return (
    <G transform={place(rest)}>
      <Line x1={0} x2={0} y1={-52} y2={8} stroke={line} strokeWidth={4} />
      <Path d="M3 -50 L40 0 L3 2 Z" fill="#FFF4E3" stroke={line} strokeWidth={3} strokeLinejoin="round" />
      <Path d="M-3 -40 L-30 2 L-3 4 Z" fill="#E0662B" stroke={line} strokeWidth={3} strokeLinejoin="round" />
      <Path d="M-46 10 L46 10 L32 34 L-32 34 Z" fill="#A5512A" stroke={line} strokeWidth={3} strokeLinejoin="round" />
      <Path
        d="M-62 44 C-50 34 -40 54 -28 44 C-16 34 -6 54 6 44 C18 34 28 54 40 44 C50 36 58 44 64 44"
        fill="none"
        stroke="#1E9E97"
        strokeWidth={5}
        strokeLinecap="round"
      />
    </G>
  );
}

export function Lighthouse({ line = INK, ...rest }: DoodleProps) {
  return (
    <G transform={place(rest)}>
      <Path d="M-16 -32 L16 -32 L26 60 L-26 60 Z" fill="#FFF4E3" stroke={line} strokeWidth={3} strokeLinejoin="round" />
      <Path d="M-18 -10 L18 -10 L20 12 L-20 12 Z M-23 34 L23 34 L26 60 L-26 60 Z" fill="#E5533D" stroke={line} strokeWidth={2.5} strokeLinejoin="round" />
      <Rect x={-20} y={-40} width={40} height={9} rx={2} fill="#3B2318" />
      <Rect x={-12} y={-60} width={24} height={20} rx={2} fill="#F7B733" stroke={line} strokeWidth={3} />
      <Path d="M-16 -60 L0 -76 L16 -60 Z" fill="#E5533D" stroke={line} strokeWidth={3} strokeLinejoin="round" />
      <Path d="M18 -54 L52 -66 M18 -48 L54 -46" stroke="#F7B733" strokeWidth={4} strokeLinecap="round" />
    </G>
  );
}

export function CloudHouse({ line = INK, ...rest }: DoodleProps) {
  return (
    <G transform={place(rest)}>
      <Rect x={-34} y={-20} width={68} height={48} fill="#FFF4E3" stroke={line} strokeWidth={3} />
      <Path d="M-44 -18 L0 -56 L44 -18 Z" fill="#E0662B" stroke={line} strokeWidth={3} strokeLinejoin="round" />
      <Rect x={-8} y={2} width={18} height={26} rx={2} fill="#A5512A" stroke={line} strokeWidth={2.5} />
      <Rect x={-27} y={-8} width={14} height={14} fill="#9FD8D2" stroke={line} strokeWidth={2.5} />
      <Rect x={15} y={-8} width={14} height={14} fill="#9FD8D2" stroke={line} strokeWidth={2.5} />
      <Path
        d="M-70 44 C-84 36 -72 18 -56 26 C-48 14 -24 18 -22 28 C-10 18 12 20 16 30 C26 20 50 18 54 30 C70 22 86 38 68 46 Z"
        fill="#FFFFFF"
        stroke={line}
        strokeWidth={3}
        strokeLinejoin="round"
      />
    </G>
  );
}

export function Mountain({ line = INK, ...rest }: DoodleProps) {
  return (
    <G transform={place(rest)}>
      <Path d="M-90 50 L-30 -30 L10 22 L34 -8 L92 50 Z" fill="#8E7CB8" stroke={line} strokeWidth={3} strokeLinejoin="round" />
      <Path d="M-46 -8 L-30 -30 L-12 -6 L-22 -12 L-30 -2 L-38 -12 Z" fill="#FFFFFF" stroke={line} strokeWidth={2.5} strokeLinejoin="round" />
      <Path d="M22 7 L34 -8 L48 8 L40 4 L34 12 L28 4 Z" fill="#FFFFFF" stroke={line} strokeWidth={2.5} strokeLinejoin="round" />
    </G>
  );
}

export function FinishFlag({ line = INK, ...rest }: DoodleProps) {
  return (
    <G transform={place(rest)}>
      <Line x1={0} x2={0} y1={-70} y2={18} stroke={line} strokeWidth={5} strokeLinecap="round" />
      <Path d="M3 -68 L58 -48 L3 -26 Z" fill="#E5533D" stroke={line} strokeWidth={3} strokeLinejoin="round" />
      <Ellipse cx={0} cy={20} rx={20} ry={6} fill={line} opacity={0.3} />
    </G>
  );
}
