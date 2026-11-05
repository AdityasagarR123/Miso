import type { Exercise } from '@/course/types';

import { MatchPairs } from './MatchPairs';
import { MultipleChoice } from './MultipleChoice';
import { Translate } from './Translate';
import type { ExerciseProps } from './types';

export function ExerciseView({
  exercise,
  locked,
  onResult,
}: ExerciseProps<Exercise>) {
  switch (exercise.type) {
    case 'multiple_choice':
      return (
        <MultipleChoice exercise={exercise} locked={locked} onResult={onResult} />
      );
    case 'match_pairs':
      return <MatchPairs exercise={exercise} locked={locked} onResult={onResult} />;
    case 'translate':
      return <Translate exercise={exercise} locked={locked} onResult={onResult} />;
  }
}
