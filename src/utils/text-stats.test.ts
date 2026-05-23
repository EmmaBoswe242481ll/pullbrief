import {
  countWords,
  countSentences,
  countLines,
  computeTextStats,
  formatTextStatsMarkdown,
} from './text-stats';

describe('countWords', () => {
  it('returns 0 for empty string', () => {
    expect(countWords('')).toBe(0);
  });

  it('returns 0 for whitespace-only string', () => {
    expect(countWords('   ')).toBe(0);
  });

  it('counts words correctly', () => {
    expect(countWords('hello world foo')).toBe(3);
  });

  it('handles multiple spaces between words', () => {
    expect(countWords('hello   world')).toBe(2);
  });
});

describe('countSentences', () => {
  it('returns 0 for empty string', () => {
    expect(countSentences('')).toBe(0);
  });

  it('returns 1 for text without punctuation', () => {
    expect(countSentences('hello world')).toBe(1);
  });

  it('counts multiple sentences', () => {
    expect(countSentences('Hello world. How are you? Great!')).toBe(3);
  });
});

describe('countLines', () => {
  it('returns 0 for empty string', () => {
    expect(countLines('')).toBe(0);
  });

  it('ignores blank lines', () => {
    expect(countLines('line one\n\nline two\n   \nline three')).toBe(3);
  });

  it('counts a single line', () => {
    expect(countLines('only one line')).toBe(1);
  });
});

describe('computeTextStats', () => {
  it('returns zeroed stats for empty string', () => {
    const stats = computeTextStats('');
    expect(stats.charCount).toBe(0);
    expect(stats.wordCount).toBe(0);
    expect(stats.lineCount).toBe(0);
    expect(stats.sentenceCount).toBe(0);
    expect(stats.avgWordsPerSentence).toBe(0);
    expect(stats.avgCharsPerWord).toBe(0);
  });

  it('computes stats for a simple sentence', () => {
    const stats = computeTextStats('Fix the bug.');
    expect(stats.wordCount).toBe(3);
    expect(stats.sentenceCount).toBe(1);
    expect(stats.avgWordsPerSentence).toBe(3);
  });
});

describe('formatTextStatsMarkdown', () => {
  it('returns a markdown list with all stat fields', () => {
    const stats = computeTextStats('Hello world. Goodbye.');
    const output = formatTextStatsMarkdown(stats);
    expect(output).toContain('**Characters:**');
    expect(output).toContain('**Words:**');
    expect(output).toContain('**Lines:**');
    expect(output).toContain('**Sentences:**');
    expect(output).toContain('**Avg words/sentence:**');
    expect(output).toContain('**Avg chars/word:**');
  });
});
