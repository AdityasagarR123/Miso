export type MultipleChoiceExercise = {
  id: string;
  type: 'multiple_choice';
  prompt: string;
  choices: string[];
  answer: string;
};

export type MatchPairsExercise = {
  id: string;
  type: 'match_pairs';
  prompt: string;
  pairs: { left: string; right: string }[];
};

export type TranslateExercise = {
  id: string;
  type: 'translate';
  prompt: string;
  text: string;
  /** Every accepted translation. The first one must be buildable from wordBank. */
  answers: string[];
  wordBank: string[];
};

export type WriteExercise = {
  id: string;
  type: 'write';
  prompt: string;
  text: string;
  /** Every accepted answer, such as the script and its pronunciation guide. */
  answers: string[];
  hint?: string;
};

export type Exercise =
  | MultipleChoiceExercise
  | MatchPairsExercise
  | TranslateExercise
  | WriteExercise;

export type LessonKind = 'words' | 'grammar' | 'writing';

export type Lesson = {
  id: string;
  title: string;
  /** Lessons with no kind teach words. */
  kind?: LessonKind;
  exercises: Exercise[];
};

export type Unit = {
  id: string;
  title: string;
  lessons: Lesson[];
};

export type Course = {
  id: string;
  title: string;
  /** A hello in this language, shown in the language picker. */
  greeting: string;
  /** BCP 47 language tag of the language being learned. */
  learningLanguage: string;
  /** BCP 47 language tag of the language the course is taught in. */
  fromLanguage: string;
  units: Unit[];
};
