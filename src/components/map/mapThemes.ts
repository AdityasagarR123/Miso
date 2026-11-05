import type { ComponentType } from 'react';

import { Boat, Lantern, Mountain, type DoodleProps } from './Doodles';
import {
  Cactus,
  Castle,
  Croissant,
  Guitar,
  HanokGate,
  LatticeTower,
  Lavender,
  Lotus,
  PineTree,
  Pretzel,
  SakuraTree,
  SilkLantern,
  SnowPeak,
  Sun,
  Torii,
} from './LanguageDoodles';

export type RegionStyle = {
  name: string;
  top: string;
  side: string;
  token: string;
  rim: string;
};

export type MapTheme = {
  /** Matches the id of the course this world belongs to. */
  courseId: string;
  title: string;
  background: string;
  accent: string;
  /** Flips the road left to right, so each world feels different. */
  mirror: boolean;
  regions: [RegionStyle, RegionStyle, RegionStyle, RegionStyle, RegionStyle];
  doodles: ComponentType<DoodleProps>[];
};

function region(name: string, top: string, side: string, token: string, rim: string): RegionStyle {
  return { name, top, side, token, rim };
}

export function themeForCourse(courseId: string): MapTheme {
  return MAP_THEMES.find((theme) => theme.courseId === courseId) ?? MAP_THEMES[0];
}

export const MAP_THEMES: MapTheme[] = [
  {
    courseId: 'es-from-en',
    title: 'Spanish',
    background: '#FFF1DA',
    accent: '#C2410C',
    mirror: false,
    regions: [
      region('La Plaza', '#F2A33A', '#B26E14', '#C57A16', '#875109'),
      region('El Mercado', '#E0662B', '#9C3C14', '#B84A17', '#7A2D0C'),
      region('La Costa', '#2CB5AB', '#127A73', '#0B7A72', '#075550'),
      region('El Pueblo', '#D9412B', '#962613', '#A92F1B', '#74200F'),
      region('La Sierra', '#7C5A3C', '#523921', '#634427', '#412B15'),
    ],
    doodles: [Cactus, Guitar, Sun, Boat],
  },
  {
    courseId: 'fr-from-en',
    title: 'French',
    background: '#F3EEFA',
    accent: '#5F4E8C',
    mirror: true,
    regions: [
      region('Le Jardin', '#8FBF6A', '#5C8A3C', '#4F8A3C', '#2F5A22'),
      region('Le Marché', '#9B82C9', '#65509A', '#5F4E8C', '#3F3163'),
      region('La Côte', '#5DA9D6', '#2F77A3', '#2A6F99', '#1B4E6E'),
      region('Le Village', '#E7AE5B', '#AD7824', '#B57C25', '#7E5412'),
      region('Les Alpes', '#D8667F', '#A0384F', '#A83F57', '#7A2A3D'),
    ],
    doodles: [LatticeTower, Croissant, Lavender, Boat],
  },
  {
    courseId: 'de-from-en',
    title: 'German',
    background: '#EEF3E6',
    accent: '#2F5D45',
    mirror: false,
    regions: [
      region('Der Wald', '#4F9A6D', '#2C6A45', '#2F6E49', '#1C4A2F'),
      region('Der Markt', '#C9853F', '#8F5A1E', '#955F21', '#673F12'),
      region('Der Hafen', '#4A90A8', '#2A6478', '#2A6478', '#1B4553'),
      region('Das Dorf', '#C4574B', '#8C3329', '#94382D', '#68251D'),
      region('Die Alpen', '#6E7FA8', '#465679', '#4A5A80', '#313D59'),
    ],
    doodles: [Castle, Pretzel, PineTree, Mountain],
  },
  {
    courseId: 'ja-from-en',
    title: 'Japanese',
    background: '#FDEEF2',
    accent: '#B8324F',
    mirror: true,
    regions: [
      region('Sakura Park', '#F08CAB', '#BF4F76', '#BF4F76', '#8C3355'),
      region('Street Market', '#E5533D', '#A82E1C', '#B23422', '#7D2214'),
      region('Old Harbor', '#4C8FC2', '#2A628C', '#2A628C', '#1B4563'),
      region('Hill Village', '#7DAE5A', '#4C7D38', '#4F7F3A', '#315723'),
      region('Snowy Summit', '#6C8FC2', '#46628D', '#49658F', '#2F4465'),
    ],
    doodles: [Torii, SakuraTree, SnowPeak, Lantern],
  },
  {
    courseId: 'ko-from-en',
    title: 'Korean',
    background: '#E9F3F4',
    accent: '#2F5C6B',
    mirror: false,
    regions: [
      region('Lotus Pond', '#5FB89A', '#34836A', '#2F7D64', '#1D5644'),
      region('Night Market', '#D9412B', '#962613', '#A92F1B', '#74200F'),
      region('Harbor Town', '#3E7CB1', '#26567F', '#275A85', '#193E5D'),
      region('Hanok Village', '#C79A5B', '#8E6A31', '#926D32', '#664A1E'),
      region('Misty Peak', '#7A86B8', '#515C8A', '#535E8D', '#373F62'),
    ],
    doodles: [HanokGate, Lotus, SilkLantern, Mountain],
  },
];
