import {
  sanitizeString,
  sanitizeCommitMessage,
  sanitizeTitle,
  escapeMarkdown,
  sanitizeStringArray,
  normalizeWhitespace,
} from './sanitizer';

describe('sanitizeString', () => {
  it('trims leading and trailing whitespace', () => {
    expect(sanitizeString('  hello  ')).toBe('hello');
  });

  it('removes control characters', () => {
    expect(sanitizeString('hello\x00world')).toBe('helloworld');
    expect(sanitizeString('tab\x09ok')).toBe('tab\x09ok'); // tab is allowed
    expect(sanitizeString('bell\x07here')).toBe('bellhere');
  });
});

describe('sanitizeCommitMessage', () => {
  it('returns short messages unchanged', () => {
    expect(sanitizeCommitMessage('feat: add login')).toBe('feat: add login');
  });

  it('truncates messages longer than 2000 chars', () => {
    const long = 'a'.repeat(2100);
    const result = sanitizeCommitMessage(long);
    expect(result.endsWith('…')).toBe(true);
    expect(result.length).toBeLessThanOrEqual(2002);
  });
});

describe('sanitizeTitle', () => {
  it('returns normal titles unchanged', () => {
    expect(sanitizeTitle('My PR Title')).toBe('My PR Title');
  });

  it('truncates titles longer than 256 chars', () => {
    const long = 'T'.repeat(300);
    const result = sanitizeTitle(long);
    expect(result.endsWith('…')).toBe(true);
    expect(result.length).toBeLessThanOrEqual(258);
  });
});

describe('escapeMarkdown', () => {
  it('escapes asterisks and underscores', () => {
    expect(escapeMarkdown('**bold**')).toBe('\\*\\*bold\\*\\*');
    expect(escapeMarkdown('_italic_')).toBe('\\_italic\\_');
  });

  it('escapes backticks', () => {
    expect(escapeMarkdown('`code`')).toBe('\\`code\\`');
  });

  it('does not modify plain text', () => {
    expect(escapeMarkdown('hello world')).toBe('hello world');
  });
});

describe('sanitizeStringArray', () => {
  it('sanitizes each item', () => {
    expect(sanitizeStringArray(['  hello  ', 'world'])).toEqual(['hello', 'world']);
  });

  it('filters out empty strings after sanitization', () => {
    expect(sanitizeStringArray(['  ', '\x00', 'keep'])).toEqual(['keep']);
  });
});

describe('normalizeWhitespace', () => {
  it('converts CRLF to LF', () => {
    expect(normalizeWhitespace('line1\r\nline2')).toBe('line1\nline2');
  });

  it('collapses more than two consecutive newlines', () => {
    expect(normalizeWhitespace('a\n\n\n\nb')).toBe('a\n\nb');
  });

  it('trims the result', () => {
    expect(normalizeWhitespace('\n\nhello\n\n')).toBe('hello');
  });
});
