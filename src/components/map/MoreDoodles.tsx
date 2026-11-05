import { Circle, Ellipse, G, Line, Path, Rect } from 'react-native-svg';

import type { DoodleProps } from './Doodles';

const INK = '#3B2318';

function place({ x, y, scale = 1, rotate = 0 }: DoodleProps) {
  return `translate(${x} ${y}) rotate(${rotate}) scale(${scale})`;
}

const stroke = { stroke: INK, strokeWidth: 3, strokeLinejoin: 'round' as const };

export function Taco(props: DoodleProps) {
  return (
    <G transform={place(props)}>
      <Path d="M-46 24 C-46 -32 46 -32 46 24 Z" fill="#7CB65C" {...stroke} />
      <Path d="M-38 12 C-34 -12 -20 -18 -8 -18 L-14 12 Z" fill="#E5533D" {...stroke} />
      <Path d="M-50 30 C-50 -22 34 -22 34 30 Z" fill="#F2C14E" {...stroke} />
      <Circle cx={-22} cy={8} r={3} fill="#C98F2B" />
      <Circle cx={2} cy={2} r={3} fill="#C98F2B" />
      <Circle cx={12} cy={18} r={3} fill="#C98F2B" />
    </G>
  );
}

export function CityGate(props: DoodleProps) {
  return (
    <G transform={place(props)}>
      <Rect x={-58} y={-30} width={116} height={14} fill="#D8CDB9" {...stroke} />
      <Path d="M-44 -30 L0 -44 L44 -30 Z" fill="#B7A98F" {...stroke} />
      <Rect x={-54} y={-16} width={108} height={8} fill="#B7A98F" {...stroke} />
      {[-48, -26, 14, 36].map((x) => (
        <Rect key={x} x={x} y={-8} width={12} height={52} fill="#E8DFCF" {...stroke} />
      ))}
      <Rect x={-58} y={44} width={116} height={8} fill="#B7A98F" {...stroke} />
    </G>
  );
}

export function Sushi(props: DoodleProps) {
  return (
    <G transform={place(props)}>
      <Rect x={-30} y={-22} width={60} height={46} fill="#2F3E36" {...stroke} />
      <Ellipse cx={0} cy={-22} rx={30} ry={13} fill="#FFFFFF" {...stroke} />
      <Ellipse cx={0} cy={-22} rx={13} ry={6} fill="#F07B3F" {...stroke} />
      <Circle cx={3} cy={-22} r={3} fill="#7CB65C" />
      <Ellipse cx={0} cy={24} rx={30} ry={11} fill="#2F3E36" {...stroke} />
    </G>
  );
}

export function RiceBowl(props: DoodleProps) {
  return (
    <G transform={place(props)}>
      <Path d="M-46 -6 C-44 34 44 34 46 -6 Z" fill="#4A2C1D" {...stroke} />
      <Ellipse cx={0} cy={-8} rx={46} ry={18} fill="#FFF4E3" {...stroke} />
      <Path d="M-30 -10 L-8 -20 L-8 -4 Z" fill="#7CB65C" {...stroke} />
      <Path d="M8 -20 L30 -12 L10 -4 Z" fill="#E5533D" {...stroke} />
      <Circle cx={0} cy={-9} r={8} fill="#F7B733" {...stroke} />
      <Rect x={-12} y={30} width={24} height={7} rx={2} fill="#2B1810" />
    </G>
  );
}

export function LeaningTower(props: DoodleProps) {
  const rows = [-44, -26, -8, 10, 28];
  return (
    <G transform={place({ ...props, rotate: (props.rotate ?? 0) + 7 })}>
      <Rect x={-16} y={-62} width={32} height={18} fill="#F3E7D3" {...stroke} />
      {rows.map((y) => (
        <G key={y}>
          <Rect x={-22} y={y} width={44} height={18} fill="#F3E7D3" {...stroke} />
          {[-14, -2, 10].map((x) => (
            <Rect key={x} x={x} y={y + 5} width={5} height={13} rx={2} fill={INK} />
          ))}
        </G>
      ))}
      <Rect x={-26} y={46} width={52} height={8} fill="#D8CDB9" {...stroke} />
    </G>
  );
}

export function PizzaSlice(props: DoodleProps) {
  return (
    <G transform={place(props)}>
      <Path d="M-40 -24 C-14 -40 14 -40 40 -24 L0 48 Z" fill="#F7C948" {...stroke} />
      <Path d="M-42 -26 C-14 -44 14 -44 42 -26 L38 -16 C14 -32 -14 -32 -38 -16 Z" fill="#C9853F" {...stroke} />
      <Circle cx={-12} cy={-6} r={8} fill="#D9412B" {...stroke} />
      <Circle cx={14} cy={2} r={7} fill="#D9412B" {...stroke} />
      <Circle cx={0} cy={24} r={6} fill="#D9412B" {...stroke} />
    </G>
  );
}

export function Tram(props: DoodleProps) {
  return (
    <G transform={place(props)}>
      <Line x1={0} x2={0} y1={-56} y2={-38} stroke={INK} strokeWidth={3} />
      <Rect x={-56} y={-38} width={112} height={68} rx={12} fill="#F7C948" {...stroke} />
      <Rect x={-56} y={8} width={112} height={22} fill="#FFF4E3" {...stroke} />
      {[-46, -18, 10].map((x) => (
        <Rect key={x} x={x} y={-28} width={22} height={26} rx={3} fill="#9FD8D2" {...stroke} />
      ))}
      <Rect x={38} y={-28} width={12} height={50} rx={2} fill="#A5512A" {...stroke} />
      <Circle cx={-32} cy={36} r={9} fill={INK} />
      <Circle cx={32} cy={36} r={9} fill={INK} />
    </G>
  );
}

export function PaintedTile(props: DoodleProps) {
  return (
    <G transform={place(props)}>
      <Rect x={-38} y={-38} width={76} height={76} rx={5} fill="#FFFFFF" {...stroke} />
      <Path d="M0 -32 C14 -14 14 14 0 32 C-14 14 -14 -14 0 -32 Z" fill="#2A6F99" {...stroke} />
      <Path d="M-32 0 C-14 -14 14 -14 32 0 C14 14 -14 14 -32 0 Z" fill="#5DA9D6" {...stroke} />
      <Circle r={8} fill="#F7B733" {...stroke} />
    </G>
  );
}

export function Pagoda(props: DoodleProps) {
  const roof = (y: number, half: number, key: string) => (
    <Path
      key={key}
      d={`M${-half} ${y + 12} C${-half + 14} ${y + 6} ${-half + 22} ${y} ${-half + 26} ${y - 8} H${half - 26} C${half - 22} ${y} ${half - 14} ${y + 6} ${half} ${y + 12} Z`}
      fill="#2F8F83"
      {...stroke}
    />
  );
  return (
    <G transform={place(props)}>
      <Line x1={0} x2={0} y1={-74} y2={-52} stroke={INK} strokeWidth={4} />
      <Rect x={-14} y={-36} width={28} height={22} fill="#D9412B" {...stroke} />
      <Rect x={-20} y={-6} width={40} height={24} fill="#D9412B" {...stroke} />
      <Rect x={-26} y={26} width={52} height={28} fill="#D9412B" {...stroke} />
      <Rect x={-7} y={36} width={14} height={18} fill="#F7B733" {...stroke} />
      {roof(-46, 34, 'a')}
      {roof(-16, 42, 'b')}
      {roof(14, 50, 'c')}
    </G>
  );
}

export function Panda(props: DoodleProps) {
  return (
    <G transform={place(props)}>
      <Ellipse cx={0} cy={22} rx={30} ry={28} fill="#FFFFFF" {...stroke} />
      <Ellipse cx={-26} cy={28} rx={11} ry={16} fill={INK} />
      <Ellipse cx={26} cy={28} rx={11} ry={16} fill={INK} />
      <Circle cx={-24} cy={-36} r={11} fill={INK} />
      <Circle cx={24} cy={-36} r={11} fill={INK} />
      <Ellipse cx={0} cy={-16} rx={32} ry={28} fill="#FFFFFF" {...stroke} />
      <Ellipse cx={-13} cy={-18} rx={8} ry={10} fill={INK} />
      <Ellipse cx={13} cy={-18} rx={8} ry={10} fill={INK} />
      <Circle cx={-11} cy={-20} r={2.5} fill="#FFFFFF" />
      <Circle cx={15} cy={-20} r={2.5} fill="#FFFFFF" />
      <Ellipse cx={0} cy={-5} rx={5} ry={3.5} fill={INK} />
    </G>
  );
}

export function DomePalace(props: DoodleProps) {
  return (
    <G transform={place(props)}>
      <Rect x={-70} y={40} width={140} height={10} fill="#D8CDB9" {...stroke} />
      <Rect x={-44} y={-4} width={88} height={44} fill="#FBF3E4" {...stroke} />
      <Path d="M-12 40 V18 C-12 2 12 2 12 18 V40 Z" fill="#9FC7D8" {...stroke} />
      <Path d="M-28 -4 C-34 -30 -10 -36 0 -56 C10 -36 34 -30 28 -4 Z" fill="#FBF3E4" {...stroke} />
      <Line x1={0} x2={0} y1={-66} y2={-54} stroke={INK} strokeWidth={3} />
      {[-62, 58].map((x) => (
        <G key={x}>
          <Rect x={x} y={-22} width={8} height={62} fill="#FBF3E4" {...stroke} />
          <Path d={`M${x - 3} -22 C${x - 1} -34 ${x + 9} -34 ${x + 11} -22 Z`} fill="#FBF3E4" {...stroke} />
        </G>
      ))}
    </G>
  );
}

export function Samosa(props: DoodleProps) {
  return (
    <G transform={place(props)}>
      <Path d="M0 -36 C8 -32 42 28 40 32 C36 38 -36 38 -40 32 C-42 28 -8 -32 0 -36 Z" fill="#DE9A3C" {...stroke} />
      <Path d="M0 -36 C4 -8 6 12 2 34" fill="none" stroke={INK} strokeWidth={2.5} />
      <Circle cx={-14} cy={18} r={2.5} fill="#A9651F" />
      <Circle cx={18} cy={14} r={2.5} fill="#A9651F" />
    </G>
  );
}

export function BrassLantern(props: DoodleProps) {
  return (
    <G transform={place(props)}>
      <Path d="M-8 -60 C-12 -74 12 -74 8 -60" fill="none" stroke={INK} strokeWidth={3} />
      <Path d="M0 -60 L22 -36 H-22 Z" fill="#B7791F" {...stroke} />
      <Path d="M-22 -36 H22 L28 18 L14 36 H-14 L-28 18 Z" fill="#F7C948" {...stroke} />
      <Path d="M0 -36 V36 M-22 -36 L-14 36 M22 -36 L14 36" fill="none" stroke={INK} strokeWidth={2.5} />
      <Rect x={-16} y={36} width={32} height={8} rx={2} fill="#B7791F" {...stroke} />
    </G>
  );
}

export function PalmTree(props: DoodleProps) {
  return (
    <G transform={place(props)}>
      <Path d="M-4 54 C-2 22 0 -4 8 -24 L16 -22 C10 0 8 24 10 54 Z" fill="#A5693A" {...stroke} />
      <Path d="M10 -24 C-14 -48 -38 -38 -46 -18 C-26 -28 -8 -28 10 -24 Z" fill="#6BAF5B" {...stroke} />
      <Path d="M10 -24 C30 -50 54 -42 60 -20 C42 -30 26 -30 10 -24 Z" fill="#6BAF5B" {...stroke} />
      <Path d="M10 -24 C4 -48 14 -62 30 -66 C26 -48 22 -36 10 -24 Z" fill="#7CB65C" {...stroke} />
      <Path d="M10 -24 C-14 -24 -28 -8 -28 8 C-14 -6 -2 -14 10 -24 Z" fill="#7CB65C" {...stroke} />
      <Path d="M10 -24 C32 -24 46 -6 44 10 C32 -6 22 -14 10 -24 Z" fill="#7CB65C" {...stroke} />
    </G>
  );
}
