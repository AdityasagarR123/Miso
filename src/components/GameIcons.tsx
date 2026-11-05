import Svg, { Circle, Path } from 'react-native-svg';

type IconProps = {
  size?: number;
};

const OUTLINE = '#3B2318';

export function HeartIcon({ size = 24 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      <Path
        d="M32 56 C14 43 6 33 6 22 C6 12 14 7 21 7 C26 7 30 10 32 14 C34 10 38 7 43 7 C50 7 58 12 58 22 C58 33 50 43 32 56 Z"
        fill="#E5533D"
        stroke={OUTLINE}
        strokeWidth={4}
        strokeLinejoin="round"
      />
      <Path
        d="M32 50 C47 40 53 32 54 24 C50 36 42 43 32 50 Z"
        fill="#B93A2A"
      />
      <Path
        d="M15 22 C15 17 18 14 22 14"
        fill="none"
        stroke="#FFD7CC"
        strokeWidth={5}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function XpIcon({ size = 24 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      <Path
        d="M32 5 L40 22 L59 25 L45 38 L49 58 L32 48 L15 58 L19 38 L5 25 L24 22 Z"
        fill="#F7B733"
        stroke={OUTLINE}
        strokeWidth={4}
        strokeLinejoin="round"
      />
      <Path
        d="M32 48 L49 58 L45 38 L59 25 L46 27 L40 40 Z"
        fill="#E0912A"
      />
      <Path
        d="M26 25 L31 15"
        stroke="#FFF1C9"
        strokeWidth={5}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function StreakIcon({ size = 24 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      <Path
        d="M33 4 C37 16 51 23 51 40 C51 52 42 60 32 60 C21 60 13 52 13 41 C13 32 18 27 22 21 C23 27 25 30 28 31 C27 21 28 12 33 4 Z"
        fill="#EE6C2B"
        stroke={OUTLINE}
        strokeWidth={4}
        strokeLinejoin="round"
      />
      <Path
        d="M32 29 C34 36 42 39 42 47 C42 53 37 57 32 57 C27 57 22 53 22 47 C22 41 28 37 32 29 Z"
        fill="#F9C74F"
      />
    </Svg>
  );
}

export function PracticeIcon({ size = 24 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      <Circle cx={30} cy={34} r={25} fill="#FFF4E3" stroke={OUTLINE} strokeWidth={4} />
      <Circle cx={30} cy={34} r={16} fill="#14A89D" stroke={OUTLINE} strokeWidth={3} />
      <Circle cx={30} cy={34} r={7} fill="#FFF4E3" stroke={OUTLINE} strokeWidth={3} />
      <Path d="M30 34 L54 10" stroke={OUTLINE} strokeWidth={4} strokeLinecap="round" />
      <Path
        d="M50 5 L51 13 L59 14 L53 20 L45 19 L44 11 Z"
        fill="#E5533D"
        stroke={OUTLINE}
        strokeWidth={3}
        strokeLinejoin="round"
      />
    </Svg>
  );
}
