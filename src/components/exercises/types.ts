export type ExerciseResult = {
  correct: boolean;
  /** Extra feedback, such as the correct answer after a mistake. */
  detail?: string;
};

export type ExerciseProps<T> = {
  exercise: T;
  /** True once the exercise is answered, so it can no longer be changed. */
  locked: boolean;
  onResult: (result: ExerciseResult) => void;
};
