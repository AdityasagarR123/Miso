import type { Course, Lesson } from './types';

export const spanishCourse: Course = {
  id: 'es-from-en',
  title: 'Spanish',
  learningLanguage: 'es',
  fromLanguage: 'en',
  units: [
    {
      id: 'basics',
      title: 'Basics',
      lessons: [
        {
          id: 'greetings',
          title: 'Greetings',
          exercises: [
            {
              id: 'greetings-1',
              type: 'multiple_choice',
              prompt: 'How do you say "hello"?',
              choices: ['Hola', 'Adiós', 'Gracias'],
              answer: 'Hola',
            },
            {
              id: 'greetings-2',
              type: 'multiple_choice',
              prompt: 'What does "gracias" mean?',
              choices: ['Please', 'Thank you', 'Goodbye'],
              answer: 'Thank you',
            },
            {
              id: 'greetings-3',
              type: 'match_pairs',
              prompt: 'Match the pairs',
              pairs: [
                { left: 'hola', right: 'hello' },
                { left: 'adiós', right: 'goodbye' },
                { left: 'gracias', right: 'thank you' },
                { left: 'por favor', right: 'please' },
              ],
            },
            {
              id: 'greetings-4',
              type: 'translate',
              prompt: 'Translate into Spanish',
              text: 'Good morning',
              answers: ['Buenos días'],
              wordBank: ['Buenos', 'días', 'noches', 'Buenas'],
            },
            {
              id: 'greetings-5',
              type: 'translate',
              prompt: 'Translate into English',
              text: 'Buenas noches',
              answers: ['Good night', 'Good evening'],
              wordBank: ['Good', 'night', 'morning', 'hello'],
            },
          ],
        },
        {
          id: 'introductions',
          title: 'Introductions',
          exercises: [
            {
              id: 'introductions-1',
              type: 'multiple_choice',
              prompt: 'How do you say "My name is Ana"?',
              choices: ['Me llamo Ana', 'Me gusta Ana', 'Soy de Ana'],
              answer: 'Me llamo Ana',
            },
            {
              id: 'introductions-2',
              type: 'multiple_choice',
              prompt: 'What does "¿Cómo estás?" mean?',
              choices: [
                'How are you?',
                "What's your name?",
                'Where are you from?',
              ],
              answer: 'How are you?',
            },
            {
              id: 'introductions-3',
              type: 'match_pairs',
              prompt: 'Match the pairs',
              pairs: [
                { left: 'yo', right: 'I' },
                { left: 'tú', right: 'you' },
                { left: 'sí', right: 'yes' },
                { left: 'amigo', right: 'friend' },
              ],
            },
            {
              id: 'introductions-4',
              type: 'translate',
              prompt: 'Translate into Spanish',
              text: 'I am from Mexico',
              answers: ['Soy de México', 'Yo soy de México'],
              wordBank: ['Soy', 'de', 'México', 'Hola', 'tú'],
            },
            {
              id: 'introductions-5',
              type: 'translate',
              prompt: 'Translate into English',
              text: 'Mucho gusto',
              answers: ['Nice to meet you', 'Pleased to meet you'],
              wordBank: ['Nice', 'to', 'meet', 'you', 'thank', 'goodbye'],
            },
          ],
        },
      ],
    },
  ],
};

/** Every lesson in course order, across units. */
export const allLessons: Lesson[] = spanishCourse.units.flatMap(
  (unit) => unit.lessons,
);
