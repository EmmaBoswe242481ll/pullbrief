/**
 * Provides basic text statistics utilities for PR summary analysis.
 */

export interface TextStats {
  charCount: number;
  wordCount: number;
  lineCount: number;
  sentenceCount: number;
  avgWordsPerSentence: number;
  avgCharsPerWord: number;
}

/**
 * Counts the number of words in a string.
 */
export function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

/**
 * Counts the number of sentences in a string.
 * A sentence ends with '.', '!', or '?'.
 */
export function countSentences(text: string): number {
  const matches = text.match(/[^.!?]*[.!?]+/g);
  return matches ? matches.length : (text.trim() ? 1 : 0);
}

/**
 * Counts non-empty lines in a string.
 */
export function countLines(text: string): number {
  return text.split('\n').filter((line) => line.trim().length > 0).length;
}

/**
 * Computes full text statistics for a given string.
 */
export function computeTextStats(text: string): TextStats {
  const charCount = text.length;
  const wordCount = countWords(text);
  const lineCount = countLines(text);
  const sentenceCount = countSentences(text);

  const avgWordsPerSentence =
    sentenceCount > 0 ? Math.round((wordCount / sentenceCount) * 10) / 10 : 0;

  const words = text.trim().split(/\s+/).filter(Boolean);
  const totalChars = words.reduce((sum, w) => sum + w.replace(/[^a-zA-Z0-9]/g, '').length, 0);
  const avgCharsPerWord =
    wordCount > 0 ? Math.round((totalChars / wordCount) * 10) / 10 : 0;

  return {
    charCount,
    wordCount,
    lineCount,
    sentenceCount,
    avgWordsPerSentence,
    avgCharsPerWord,
  };
}

/**
 * Formats text stats as a human-readable markdown snippet.
 */
export function formatTextStatsMarkdown(stats: TextStats): string {
  return [
    `- **Characters:** ${stats.charCount}`,
    `- **Words:** ${stats.wordCount}`,
    `- **Lines:** ${stats.lineCount}`,
    `- **Sentences:** ${stats.sentenceCount}`,
    `- **Avg words/sentence:** ${stats.avgWordsPerSentence}`,
    `- **Avg chars/word:** ${stats.avgCharsPerWord}`,
  ].join('\n');
}
