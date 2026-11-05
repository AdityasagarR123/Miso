import type { Course, Lesson } from './types';

export type Level = {
  /** Matches the id of the unit that holds this level's lessons in a course. */
  id: string;
  number: number;
  title: string;
  region: string;
};

/** The same 10 levels are shared by every language. */
export const LEVEL_PLAN: Level[] = [
  { id: 'basics', number: 1, title: 'Basics', region: 'Bamboo Grove' },
  { id: 'people', number: 2, title: 'People and family', region: 'Bamboo Grove' },
  { id: 'food', number: 3, title: 'Food and drink', region: 'Market Town' },
  { id: 'shopping', number: 4, title: 'Shopping and money', region: 'Market Town' },
  { id: 'travel', number: 5, title: 'Travel and directions', region: 'Harbor Bay' },
  { id: 'getting-around', number: 6, title: 'Hotels and getting around', region: 'Harbor Bay' },
  { id: 'daily-life', number: 7, title: 'Daily routine', region: 'Cloud Village' },
  { id: 'work-hobbies', number: 8, title: 'Work and hobbies', region: 'Cloud Village' },
  { id: 'past-future', number: 9, title: 'Past and future', region: 'Starlight Peak' },
  { id: 'conversations', number: 10, title: 'Real conversations', region: 'Starlight Peak' },
];

/** Every lesson in a course, in order, across its levels. */
export function lessonsOf(course: Course): Lesson[] {
  return LEVEL_PLAN.flatMap(
    (level) => course.units.find((unit) => unit.id === level.id)?.lessons ?? [],
  );
}
