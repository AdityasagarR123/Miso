import type { ImageSourcePropType } from 'react-native';

export type Character = {
  name: string;
  image: ImageSourcePropType;
  /** Waist-up art is wider than Biso's full-body art. */
  aspectRatio: number;
  intro: string;
};

const BISO = require('../../assets/brand/biso-full.png');

/** Who teaches each level. Levels without their own character get Biso. */
const CHARACTERS: Record<string, Character> = {
  basics: {
    name: 'Mira',
    image: require('../../assets/characters/mira.png'),
    aspectRatio: 402 / 598,
    intro: "Hi, I'm Mira, your neighbor! Let's start with words you'll use every day.",
  },
  people: {
    name: 'Nana Rosa',
    image: require('../../assets/characters/rosa.png'),
    aspectRatio: 542 / 573,
    intro: "Hello, dear! I'm Nana Rosa. Let me teach you how to talk about people.",
  },
  food: {
    name: 'Chef Theo',
    image: require('../../assets/characters/theo.png'),
    aspectRatio: 427 / 577,
    intro: "Welcome to my kitchen! I'm Chef Theo. Let's learn to talk about food.",
  },
  shopping: {
    name: 'Lena',
    image: require('../../assets/characters/lena.png'),
    aspectRatio: 459 / 567,
    intro: "Hi, I'm Lena from the corner shop. Let's learn the words for shopping.",
  },
  travel: {
    name: 'Sam',
    image: require('../../assets/characters/sam.png'),
    aspectRatio: 463 / 538,
    intro: "Hop in! I'm Sam, your taxi driver. Let's learn to find your way.",
  },
  'getting-around': {
    name: 'Noor',
    image: require('../../assets/characters/noor.png'),
    aspectRatio: 502 / 574,
    intro: "Welcome! I'm Noor from the hotel desk. Let's learn what to say at a hotel.",
  },
  'daily-life': {
    name: 'Dr. Asha',
    image: require('../../assets/characters/asha.png'),
    aspectRatio: 466 / 626,
    intro: "Hi, I'm Dr. Asha. Let's talk about your daily routine.",
  },
};

export function characterForLevel(levelId: string): Character {
  return (
    CHARACTERS[levelId] ?? {
      name: 'Biso',
      image: BISO,
      aspectRatio: 732 / 690,
      intro: "Biso here! Let's learn some new words together.",
    }
  );
}
