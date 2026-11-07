import { buildUnits, type LanguageKey } from './buildCourse';
import { GRAMMAR } from './grammar';
import { LEVEL_PLAN } from './levels';
import { PHRASEBOOK } from './phrasebook';
import { spanishCourse } from './spanish';
import type { Course, Lesson } from './types';

/** Adds a teaching step to a hand-written lesson, using its matching pairs. */
function withTeachStep(lesson: Lesson): Lesson {
  const pairs = lesson.exercises.find((exercise) => exercise.type === 'match_pairs');
  if (!pairs || pairs.type !== 'match_pairs') return lesson;
  return {
    ...lesson,
    exercises: [
      {
        id: `${lesson.id}-teach`,
        type: 'teach',
        prompt: 'Learn these words',
        items: pairs.pairs.map((pair) => ({ english: pair.right, target: pair.left })),
      },
      ...lesson.exercises,
    ],
  };
}

function language(key: LanguageKey, title: string, greeting: string): Course {
  return {
    id: `${key}-from-en`,
    title,
    greeting,
    learningLanguage: key,
    fromLanguage: 'en',
    units: buildUnits(LEVEL_PLAN, PHRASEBOOK, key, title, GRAMMAR[key]),
  };
}

const spanishUnits = buildUnits(LEVEL_PLAN, PHRASEBOOK, 'es', 'Spanish', GRAMMAR.es);

// Spanish keeps its longer, hand-written word lessons, so saved progress still
// works, and gets the same grammar and writing lessons as every other language.
const spanish: Course = {
  ...spanishCourse,
  units: spanishUnits.map((unit) => {
    const handWritten = spanishCourse.units.find((item) => item.id === unit.id);
    if (!handWritten) return unit;
    return {
      ...handWritten,
      lessons: [
        ...handWritten.lessons.map(withTeachStep),
        ...unit.lessons.filter((lesson) => lesson.kind !== 'words'),
      ],
    };
  }),
};

/** The ten languages Biso teaches. */
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
