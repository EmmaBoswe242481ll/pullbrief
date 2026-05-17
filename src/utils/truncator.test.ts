import { truncateString, truncateArray, truncateLines, DEFAULT_ELLIPSIS } from './truncator';

describe('truncateString', () => {
  it('returns the original string when within maxLength', () => {
    expect(truncateString('hello world', { maxLength: 20 })).toBe('hello world');
  });

  it('truncates to maxLength with ellipsis', () => {
    const result = truncateString('hello world foo bar', { maxLength: 10, preserveWords: false });
    expect(result).toBe('hello w...');
    expect(result.length).toBe(10);
  });

  it('preserves word boundaries when preserveWords is true', () => {
    const result = truncateString('hello world foo bar', { maxLength: 14, preserveWords: true });
    expect(result).toBe('hello world...');
  });

  it('uses custom ellipsis', () => {
    const result = truncateString('abcdefgh', { maxLength: 5, ellipsis: '…', preserveWords: false });
    expect(result).toBe('abcd…');
  });

  it('handles maxLength shorter than ellipsis', () => {
    const result = truncateString('abcdef', { maxLength: 2, ellipsis: '...', preserveWords: false });
    expect(result.length).toBeLessThanOrEqual(3);
  });

  it('returns string unchanged when exactly at maxLength', () => {
    expect(truncateString('hello', { maxLength: 5 })).toBe('hello');
  });
});

describe('truncateArray', () => {
  const items = ['a', 'b', 'c', 'd', 'e'];

  it('returns all items when within maxItems', () => {
    const result = truncateArray(items, 10);
    expect(result.items).toEqual(items);
    expect(result.omitted).toBe(0);
  });

  it('truncates array and reports omitted count', () => {
    const result = truncateArray(items, 3);
    expect(result.items).toEqual(['a', 'b', 'c']);
    expect(result.omitted).toBe(2);
  });

  it('handles empty arrays', () => {
    const result = truncateArray([], 5);
    expect(result.items).toEqual([]);
    expect(result.omitted).toBe(0);
  });

  it('works with exactly maxItems elements', () => {
    const result = truncateArray(items, 5);
    expect(result.omitted).toBe(0);
  });
});

describe('truncateLines', () => {
  const multiline = 'line1\nline2\nline3\nline4\nline5';

  it('returns original when within maxLines', () => {
    expect(truncateLines(multiline, 10)).toBe(multiline);
  });

  it('truncates to maxLines and appends ellipsis', () => {
    const result = truncateLines(multiline, 3);
    expect(result).toBe(`line1\nline2\nline3\n${DEFAULT_ELLIPSIS}`);
  });

  it('uses custom ellipsis', () => {
    const result = truncateLines(multiline, 2, '(more)');
    expect(result).toBe('line1\nline2\n(more)');
  });

  it('handles single line strings', () => {
    expect(truncateLines('only one line', 5)).toBe('only one line');
  });
});
