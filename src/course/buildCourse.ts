import type { GrammarQuestion } from './grammar';
import type { Level } from './levels';
import type { Phrase, Scripted } from './phrasebook';
import type { Exercise, Lesson, Unit } from './types';

export type LanguageKey = Exclude<keyof Phrase, 'en'>;

const PHRASES_PER_LEVEL = 8;
const PHRASES_PER_LESSON = 4;
const GRAMMAR_PER_LEVEL = 2;
const GRAMMAR_PER_LESSON = 5;
const WRITING_PER_LESSON = 6;

type Item = { english: string; target: string };

function toItem(phrase: Phrase, language: LanguageKey): Item {
  const value = phrase[language];
  // Scripts a beginner can't read yet always show how to say them.
  const target =
    typeof value === 'string'
      ? value
      : `${(value as Scripted)[0]} (${(value as Scripted)[1]})`;
  return { english: phrase.en, target };
}

function otherChoices(items: Item[], index: number, field: keyof Item): string[] {
  const answer = items[index][field];
  const others = [...new Set(items.map((item) => item[field]))].filter(
    (value) => value !== answer,
  );
  // Rotates by position, so the wrong answers vary between questions.
  return Array.from(
    { length: Math.min(2, others.length) },
    (_, offset) => others[(index + offset) % others.length],
  );
}

function buildExercises(
  lessonId: string,
  languageTitle: string,
  items: Item[],
  allItems: Item[],
): Exercise[] {
  const meaning = (index: number, n: number): Exercise => ({
    id: `${lessonId}-${n}`,
    type: 'multiple_choice',
    prompt: `What does "${items[index].target}" mean?`,
    choices: [items[index].english, ...otherChoices(items, index, 'english')],
    answer: items[index].english,
  });
  const say = (index: number, n: number): Exercise => ({
    id: `${lessonId}-${n}`,
    type: 'multiple_choice',
    prompt: `How do you say "${items[index].english}" in ${languageTitle}?`,
    choices: [items[index].target, ...otherChoices(items, index, 'target')],
    answer: items[index].target,
  });

  // Translation practice uses the longest phrase, because it has the most to build.
  const longest = [...items].sort(
    (a, b) => b.english.split(' ').length - a.english.split(' ').length,
  )[0];
  const answerWords = longest.english.split(' ');
  const spareWords = allItems
    .flatMap((item) => item.english.split(' '))
    .filter((word) => !answerWords.includes(word));

  return [
    meaning(0, 1),
    say(1, 2),
    {
      id: `${lessonId}-3`,
      type: 'match_pairs',
      prompt: 'Match the pairs',
      pairs: items.map((item) => ({ left: item.target, right: item.english })),
    },
    meaning(2, 4),
    say(3, 5),
    {
      id: `${lessonId}-6`,
      type: 'translate',
      prompt: 'Translate into English',
      text: longest.target,
      answers: [longest.english],
      wordBank: [...answerWords, ...new Set(spareWords.slice(0, 2))],
    },
  ];
}

/** This level's questions come first, then a review of the ones just before. */
function buildGrammarLesson(
  id: string,
  levelIndex: number,
  grammar: readonly GrammarQuestion[],
): Lesson {
  const end = (levelIndex + 1) * GRAMMAR_PER_LEVEL;
  const newStart = end - GRAMMAR_PER_LEVEL;
  const reviewStart = Math.max(0, end - GRAMMAR_PER_LESSON);
  const questions = [
    ...grammar.slice(newStart, end),
    ...grammar.slice(reviewStart, newStart).reverse(),
  ];

  return {
    id,
    title: 'Grammar',
    kind: 'grammar',
    exercises: questions.map(([prompt, answer, ...wrong], index) => ({
      id: `${id}-${index + 1}`,
      type: 'multiple_choice',
      prompt,
      choices: [answer, ...wrong],
      answer,
    })),
  };
}

/** The learner types the level's shortest phrases, which are fairest to write. */
function buildWritingLesson(
  id: string,
  phrases: readonly Phrase[],
  language: LanguageKey,
  languageTitle: string,
): Lesson {
  const chosen = new Set(
    [...phrases]
      .sort((a, b) => answersOf(a, language)[0].length - answersOf(b, language)[0].length)
      .slice(0, WRITING_PER_LESSON),
  );

  return {
    id,
    title: 'Writing',
    kind: 'writing',
    exercises: phrases
      .filter((phrase) => chosen.has(phrase))
      .map((phrase, index) => {
        const answers = answersOf(phrase, language);
        return {
          id: `${id}-${index + 1}`,
          type: 'write',
          prompt: `Write this in ${languageTitle}`,
          text: phrase.en,
          answers,
          hint:
            answers.length > 1
              ? 'The native script or Latin letters both work.'
              : 'Accents and capital letters are optional.',
        };
      }),
  };
}

function answersOf(phrase: Phrase, language: LanguageKey): string[] {
  const value = phrase[language];
  return typeof value === 'string' ? [value] : [...(value as Scripted)];
}

/** Builds every level of a language from the shared phrasebook and grammar. */
export function buildUnits(
  levels: readonly Level[],
  phrases: readonly Phrase[],
  language: LanguageKey,
  languageTitle: string,
  grammar: readonly GrammarQuestion[],
): Unit[] {
  return levels.map((level, levelIndex) => {
    const start = levelIndex * PHRASES_PER_LEVEL;
    const levelPhrases = phrases.slice(start, start + PHRASES_PER_LEVEL);
    const items = levelPhrases.map((phrase) => toItem(phrase, language));

    const lessons: Lesson[] = [0, 1].map((part) => {
      const id = `${language}-${level.id}-${part + 1}`;
      const lessonItems = items.slice(
        part * PHRASES_PER_LESSON,
        (part + 1) * PHRASES_PER_LESSON,
      );
      return {
        id,
        title: `Words ${part + 1}`,
        kind: 'words',
        exercises: buildExercises(id, languageTitle, lessonItems, items),
      };
    });

    const baseId = `${language}-${level.id}`;
    lessons.push(
      buildGrammarLesson(`${baseId}-grammar`, levelIndex, grammar),
      buildWritingLesson(`${baseId}-writing`, levelPhrases, language, languageTitle),
    );

    return { id: level.id, title: level.title, lessons };
  });
}
