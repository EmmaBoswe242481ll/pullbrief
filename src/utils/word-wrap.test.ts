import { wrapText, wrapLines } from './word-wrap';

describe('wrapText', () => {
  it('returns short text unchanged', () => {
    expect(wrapText('hello world', { width: 80 })).toBe('hello world');
  });

  it('wraps text at the specified width', () => {
    const input = 'one two three four five six seven eight';
    const result = wrapText(input, { width: 20 });
    const lines = result.split('\n');
    lines.forEach((line) => expect(line.length).toBeLessThanOrEqual(20));
  });

  it('preserves empty lines as paragraph breaks', () => {
    const input = 'first line\n\nsecond line';
    const result = wrapText(input, { width: 80 });
    expect(result).toContain('\n\n');
  });

  it('applies indent to every wrapped line', () => {
    const input = 'alpha beta gamma delta epsilon zeta eta theta iota kappa';
    const result = wrapText(input, { width: 30, indent: '  ' });
    result.split('\n').forEach((line) => {
      expect(line.startsWith('  ')).toBe(true);
    });
  });

  it('throws when indent is wider than wrap width', () => {
    expect(() => wrapText('hello', { width: 4, indent: '     ' })).toThrow(RangeError);
  });

  it('uses custom newline separator', () => {
    const input = 'one two three four five six';
    const result = wrapText(input, { width: 15, newline: '\r\n' });
    expect(result).toContain('\r\n');
    expect(result).not.toMatch(/(?<!\r)\n/);
  });

  it('breaks long words when breakLongWords is true', () => {
    const longWord = 'supercalifragilisticexpialidocious';
    const result = wrapText(longWord, { width: 10, breakLongWords: true });
    result.split('\n').forEach((line) => expect(line.length).toBeLessThanOrEqual(10));
  });

  it('does not break long words by default', () => {
    const longWord = 'supercalifragilisticexpialidocious';
    const result = wrapText(longWord, { width: 10 });
    expect(result).toBe(longWord);
  });

  it('handles multiple spaces between words gracefully', () => {
    const input = 'hello   world   foo';
    const result = wrapText(input, { width: 80 });
    expect(result).toBe('hello world foo');
  });
});

describe('wrapLines', () => {
  it('returns an array of strings', () => {
    const lines = wrapLines('one two three four five', { width: 12 });
    expect(Array.isArray(lines)).toBe(true);
    lines.forEach((l) => expect(typeof l).toBe('string'));
  });

  it('each line respects the width', () => {
    const input = 'the quick brown fox jumps over the lazy dog';
    const lines = wrapLines(input, { width: 20 });
    lines.forEach((l) => expect(l.length).toBeLessThanOrEqual(20));
  });

  it('single short word returns single-element array', () => {
    expect(wrapLines('hi', { width: 80 })).toEqual(['hi']);
  });
});
