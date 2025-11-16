import type { StaticQuestion, Question, Locale } from '../types';

/**
 * Gets the system's preferred color scheme.
 * @returns 'dark' or 'light'.
 */
export const getSystemTheme = (): 'dark' | 'light' => 
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

/**
 * Converts a hex color string to an RGB array.
 * @param hex The hex color string (e.g., '#06b6d4').
 * @returns An array [r, g, b] or null if invalid.
 */
export const hexToRgb = (hex: string): [number, number, number] | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null;
};

/**
 * Determines whether black or white text has better contrast against a given hex color.
 * @param hex The background hex color.
 * @returns '#000000' for light backgrounds, '#ffffff' for dark backgrounds.
 */
export const getContrastYIQ = (hex: string): '#000000' | '#ffffff' => {
  const rgb = hexToRgb(hex);
  if (!rgb) return '#ffffff';
  const yiq = ((rgb[0] * 299) + (rgb[1] * 587) + (rgb[2] * 114)) / 1000;
  return (yiq >= 128) ? '#000000' : '#ffffff';
};

/**
 * Formats multilingual static questions into a single-language format for gameplay.
 * @param questions The array of static questions with multiple locales.
 * @param locale The target locale ('en', 'hi', 'te').
 * @returns An array of questions formatted for the current quiz session.
 */
export const formatStaticQuestions = (questions: StaticQuestion[], locale: Locale): Question[] => {
    return questions.map(q => {
        const englishOptions = q.options.en;
        const localizedOptions = q.options[locale] || q.options.en;
        const correctOptionIndex = englishOptions.indexOf(q.answer);

        if (correctOptionIndex === -1) {
            console.error(`Data error: Correct answer "${q.answer}" not found in English options for question: "${q.question.en}"`);
            return {
                question: q.question[locale] || q.question.en,
                options: localizedOptions,
                answer: q.answer, // Fallback
                category: q.category,
                difficulty: q.difficulty,
            };
        }
        const localizedAnswer = localizedOptions[correctOptionIndex];
        return {
            question: q.question[locale] || q.question.en,
            options: localizedOptions,
            answer: localizedAnswer,
            category: q.category,
            difficulty: q.difficulty,
        };
    });
};
