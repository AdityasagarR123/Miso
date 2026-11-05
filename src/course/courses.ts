import { spanishCourse } from './spanish';
import type { Course } from './types';

function comingSoon(
  learningLanguage: string,
  title: string,
  greeting: string,
): Course {
  return {
    id: `${learningLanguage}-from-en`,
    title,
    greeting,
    learningLanguage,
    fromLanguage: 'en',
    units: [],
  };
}

/** The five languages Viso teaches. */
export const COURSES: Course[] = [
  spanishCourse,
  comingSoon('fr', 'French', 'Bonjour !'),
  comingSoon('de', 'German', 'Hallo!'),
  comingSoon('ja', 'Japanese', 'こんにちは'),
  comingSoon('ko', 'Korean', '안녕하세요'),
];

export function courseById(id: string | null): Course | null {
  return COURSES.find((course) => course.id === id) ?? null;
}
