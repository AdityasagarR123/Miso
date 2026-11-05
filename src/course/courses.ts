import { buildUnits, type LanguageKey } from './buildCourse';
import { LEVEL_PLAN } from './levels';
import { PHRASEBOOK } from './phrasebook';
import { spanishCourse } from './spanish';
import type { Course } from './types';

function language(key: LanguageKey, title: string, greeting: string): Course {
  return {
    id: `${key}-from-en`,
    title,
    greeting,
    learningLanguage: key,
    fromLanguage: 'en',
    units: buildUnits(LEVEL_PLAN, PHRASEBOOK, key, title),
  };
}

// Spanish keeps its longer, hand-written first level, so saved progress still works.
const spanish: Course = {
  ...spanishCourse,
  units: [
    ...spanishCourse.units,
    ...buildUnits(LEVEL_PLAN, PHRASEBOOK, 'es', 'Spanish').slice(
      spanishCourse.units.length,
    ),
  ],
};

/** The ten languages Viso teaches. */
export const COURSES: Course[] = [
  spanish,
  language('fr', 'French', 'Bonjour !'),
  language('de', 'German', 'Hallo!'),
  language('ja', 'Japanese', 'こんにちは'),
  language('ko', 'Korean', '안녕하세요'),
  language('it', 'Italian', 'Ciao!'),
  language('pt', 'Portuguese', 'Olá!'),
  language('zh', 'Mandarin Chinese', '你好'),
  language('hi', 'Hindi', 'नमस्ते'),
  language('ar', 'Arabic', 'مرحبا'),
];

export function courseById(id: string | null): Course | null {
  return COURSES.find((course) => course.id === id) ?? null;
}
