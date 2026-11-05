import { Circle, Ellipse, G, Line, Path, Rect } from 'react-native-svg';

import type { DoodleProps } from './Doodles';

const INK = '#3B2318';

function place({ x, y, scale = 1, rotate = 0 }: DoodleProps) {
  return `translate(${x} ${y}) rotate(${rotate}) scale(${scale})`;
}

const stroke = { stroke: INK, strokeWidth: 3, strokeLinejoin: 'round' as const };

// Spanish

export function Cactus(props: DoodleProps) {
  return (
    <G transform={place(props)}>
      <Rect x={-13} y={-56} width={26} height={96} rx={13} fill="#6BAF5B" {...stroke} />
      <Path d="M-13 0 H-30 C-40 0 -42 -8 -42 -14 V-28 C-42 -38 -28 -38 -28 -28 V-14 H-13 Z" fill="#6BAF5B" {...stroke} />
      <Path d="M13 -10 H30 C40 -10 42 -18 42 -24 V-36 C42 -46 28 -46 28 -36 V-24 H13 Z" fill="#6BAF5B" {...stroke} />
      <Circle cx={0} cy={-58} r={7} fill="#E5533D" {...stroke} />
      <Ellipse cx={0} cy={42} rx={34} ry={7} fill="#E9C79A" {...stroke} />
    </G>
  );
}

export function Guitar(props: DoodleProps) {
  return (
    <G transform={place({ ...props, rotate: props.rotate ?? 28 })}>
      <Rect x={-6} y={-70} width={12} height={62} fill="#7A4A25" {...stroke} />
      <Rect x={-10} y={-88} width={20} height={20} rx={4} fill="#5A3419" {...stroke} />
      <Path d="M0 -14 C22 -14 24 6 15 14 C30 20 30 54 0 54 C-30 54 -30 20 -15 14 C-24 6 -22 -14 0 -14 Z" fill="#E8A44C" {...stroke} />
      <Circle cx={0} cy={18} r={9} fill={INK} />
      <Rect x={-12} y={36} width={24} height={5} fill={INK} />
    </G>
  );
}

export function Sun(props: DoodleProps) {
  const rays = [0, 45, 90, 135, 180, 225, 270, 315];
  return (
    <G transform={place(props)}>
      {rays.map((angle) => (
        <Path key={angle} d="M0 -34 L7 -50 L-7 -50 Z" fill="#F2A33A" {...stroke} transform={`rotate(${angle})`} />
      ))}
      <Circle r={28} fill="#F7C948" {...stroke} />
    </G>
  );
}

// French

export function LatticeTower(props: DoodleProps) {
  return (
    <G transform={place(props)}>
      <Line x1={0} x2={0} y1={-88} y2={-70} stroke={INK} strokeWidth={4} />
      <Path d="M-5 -72 H5 L12 -18 H-12 Z" fill="#B08D72" {...stroke} />
      <Rect x={-20} y={-20} width={40} height={8} fill="#8F6E55" {...stroke} />
      <Path d="M-15 -12 H15 L20 12 H-20 Z" fill="#B08D72" {...stroke} />
      <Rect x={-30} y={10} width={60} height={8} fill="#8F6E55" {...stroke} />
      <Path d="M-26 18 L-44 60 H-26 C-22 40 22 40 26 60 H44 L26 18 Z" fill="#B08D72" {...stroke} />
    </G>
  );
}

export function Croissant(props: DoodleProps) {
  return (
    <G transform={place(props)}>
      <Path d="M-50 20 C-46 -24 -20 -36 0 -36 C20 -36 46 -24 50 20 C38 12 26 2 0 2 C-26 2 -38 12 -50 20 Z" fill="#E7AE5B" {...stroke} />
      <Path d="M-30 -24 L-24 6 M-12 -34 L-8 2 M12 -34 L8 2 M30 -24 L24 6" fill="none" stroke={INK} strokeWidth={2.5} />
    </G>
  );
}

export function Lavender(props: DoodleProps) {
  const stem = (x: number, lean: number) => (
    <G key={x}>
      <Path d={`M${x} 40 C${x} 10 ${x + lean} -10 ${x + lean} -20`} fill="none" stroke="#5F8F4E" strokeWidth={4} strokeLinecap="round" />
      {[-52, -42, -32, -22].map((y) => (
        <Ellipse key={y} cx={x + lean} cy={y} rx={8} ry={6} fill="#9B82C9" stroke={INK} strokeWidth={2} />
      ))}
    </G>
  );
  return (
    <G transform={place(props)}>
      {stem(-20, -8)}
      {stem(0, 0)}
      {stem(20, 8)}
    </G>
  );
}

// German

export function Castle(props: DoodleProps) {
  return (
    <G transform={place(props)}>
      <Rect x={-44} y={-10} width={88} height={54} fill="#E8DFCF" {...stroke} />
      <Rect x={-58} y={-34} width={28} height={78} fill="#D8CDB9" {...stroke} />
      <Rect x={30} y={-34} width={28} height={78} fill="#D8CDB9" {...stroke} />
      <Path d="M-64 -34 L-44 -68 L-24 -34 Z M24 -34 L44 -68 L64 -34 Z" fill="#2E6F8E" {...stroke} />
      <Path d="M-12 44 V20 C-12 4 12 4 12 20 V44 Z" fill="#7A4A25" {...stroke} />
      <Rect x={-49} y={-20} width={10} height={14} fill="#3B2318" />
      <Rect x={39} y={-20} width={10} height={14} fill="#3B2318" />
    </G>
  );
}

export function Pretzel(props: DoodleProps) {
  return (
    <G transform={place(props)}>
      <Path
        d="M-6 34 C-50 34 -58 -30 -24 -34 C-2 -36 8 -6 26 28 M6 34 C50 34 58 -30 24 -34 C2 -36 -8 -6 -26 28"
        fill="none"
        stroke={INK}
        strokeWidth={18}
        strokeLinecap="round"
      />
      <Path
        d="M-6 34 C-50 34 -58 -30 -24 -34 C-2 -36 8 -6 26 28 M6 34 C50 34 58 -30 24 -34 C2 -36 -8 -6 -26 28"
        fill="none"
        stroke="#B9702C"
        strokeWidth={12}
        strokeLinecap="round"
      />
    </G>
  );
}

export function PineTree(props: DoodleProps) {
  return (
    <G transform={place(props)}>
      <Rect x={-7} y={30} width={14} height={20} fill="#7A4A25" {...stroke} />
      <Path d="M0 -62 L24 -26 H12 L34 4 H18 L42 34 H-42 L-18 4 H-34 L-12 -26 H-24 Z" fill="#3F7D5A" {...stroke} />
    </G>
  );
}

// Japanese

export function Torii(props: DoodleProps) {
  return (
    <G transform={place(props)}>
      <Path d="M-66 -44 C-40 -36 40 -36 66 -44 L60 -28 H-60 Z" fill="#D9412B" {...stroke} />
      <Rect x={-52} y={-14} width={104} height={11} fill="#D9412B" {...stroke} />
      <Rect x={-40} y={-28} width={12} height={78} fill="#D9412B" {...stroke} />
      <Rect x={28} y={-28} width={12} height={78} fill="#D9412B" {...stroke} />
    </G>
  );
}

export function SakuraTree(props: DoodleProps) {
  return (
    <G transform={place(props)}>
      <Path d="M-7 48 C-4 20 -5 6 -16 -8 M-4 22 C4 8 10 2 22 -6" fill="none" stroke="#6B4226" strokeWidth={9} strokeLinecap="round" />
      <Path d="M-52 -14 C-66 -36 -36 -56 -20 -46 C-12 -68 28 -66 30 -44 C54 -48 62 -14 42 -4 C34 12 8 8 2 -2 C-12 10 -42 6 -52 -14 Z" fill="#F7B9CC" {...stroke} />
      <Circle cx={-20} cy={-24} r={4} fill="#E5779A" />
      <Circle cx={10} cy={-38} r={4} fill="#E5779A" />
      <Circle cx={30} cy={-18} r={4} fill="#E5779A" />
    </G>
  );
}

export function SnowPeak(props: DoodleProps) {
  return (
    <G transform={place(props)}>
      <Path d="M-90 44 L-22 -40 C-12 -50 12 -50 22 -40 L90 44 Z" fill="#6C8FC2" {...stroke} />
      <Path d="M-30 -30 C-20 -46 20 -46 30 -30 L14 -14 L6 -24 L-4 -10 L-14 -24 Z" fill="#FFFFFF" {...stroke} />
    </G>
  );
}

// Korean

export function HanokGate(props: DoodleProps) {
  return (
    <G transform={place(props)}>
      <Rect x={-44} y={-6} width={88} height={48} fill="#F3E7D3" {...stroke} />
      <Line x1={-16} x2={-16} y1={-6} y2={42} stroke={INK} strokeWidth={3} />
      <Line x1={16} x2={16} y1={-6} y2={42} stroke={INK} strokeWidth={3} />
      <Rect x={-12} y={8} width={24} height={34} fill="#A5512A" {...stroke} />
      <Path d="M-74 -28 C-52 -14 -40 -12 -44 -6 H44 C40 -12 52 -14 74 -28 C40 -24 26 -48 0 -48 C-26 -48 -40 -24 -74 -28 Z" fill="#3B5C6B" {...stroke} />
    </G>
  );
}

export function Lotus(props: DoodleProps) {
  return (
    <G transform={place(props)}>
      <Ellipse cx={0} cy={26} rx={56} ry={13} fill="#6BAF8B" {...stroke} />
      <Path d="M0 22 C-20 6 -40 -8 -46 -14 C-46 8 -28 22 0 22 Z" fill="#F4A6BE" {...stroke} />
      <Path d="M0 22 C20 6 40 -8 46 -14 C46 8 28 22 0 22 Z" fill="#F4A6BE" {...stroke} />
      <Path d="M0 22 C-22 2 -22 -18 -14 -30 C-6 -22 -2 -10 0 22 Z" fill="#F7C0D2" {...stroke} />
      <Path d="M0 22 C22 2 22 -18 14 -30 C6 -22 2 -10 0 22 Z" fill="#F7C0D2" {...stroke} />
      <Path d="M0 22 C-12 2 -8 -24 0 -38 C8 -24 12 2 0 22 Z" fill="#FBD6E2" {...stroke} />
    </G>
  );
}

export function SilkLantern(props: DoodleProps) {
  return (
    <G transform={place(props)}>
      <Line x1={0} x2={0} y1={-56} y2={-36} stroke={INK} strokeWidth={3} />
      <Path d="M-22 -36 H22 L28 18 H-28 Z" fill="#3E7CB1" {...stroke} />
      <Path d="M-27 2 H27 L28 18 H-28 Z" fill="#D9412B" {...stroke} />
      <Rect x={-16} y={-42} width={32} height={8} rx={2} fill="#F7B733" {...stroke} />
      <Path d="M-8 18 L-10 36 M0 18 V40 M8 18 L10 36" stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
    </G>
  );
}
