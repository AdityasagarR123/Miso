/**
 * Makes typed answers comparable. Beginners shouldn't lose a heart over capital
 * letters, punctuation or accents they can't easily type.
 */
export function normalizeWriting(text: string): string {
  return text
    .normalize('NFD')
    // Only Latin accents are optional. In Hindi or Japanese, these marks change
    // the letter itself, so they still have to be right.
    .replace(/(\p{Script=Latin})\p{M}+/gu, '$1')
    .normalize('NFC')
    .toLowerCase()
    .replace(/ß/g, 'ss')
    .replace(/[¿?¡!.,;:'’"“”؟،。、？！ʿʾ\s-]/g, '');
}

export function isWritingCorrect(input: string, answers: readonly string[]): boolean {
  const typed = normalizeWriting(input);
  return typed.length > 0 && answers.some((answer) => normalizeWriting(answer) === typed);
}
