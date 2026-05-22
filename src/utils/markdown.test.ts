import {
  inlineCode,
  heading,
  bulletList,
  orderedList,
  codeBlock,
  blockquote,
  bold,
  italic,
  link,
  joinSections,
  table,
} from './markdown';

describe('markdown utilities', () => {
  describe('inlineCode', () => {
    it('wraps text in backticks', () => {
      expect(inlineCode('foo')).toBe('`foo`');
    });
  });

  describe('heading', () => {
    it('defaults to level 2', () => {
      expect(heading('Title')).toBe('## Title');
    });

    it('respects explicit level', () => {
      expect(heading('Top', 1)).toBe('# Top');
      expect(heading('Sub', 3)).toBe('### Sub');
    });
  });

  describe('bulletList', () => {
    it('renders each item with a dash', () => {
      expect(bulletList(['a', 'b'])).toBe('- a\n- b');
    });
  });

  describe('orderedList', () => {
    it('renders numbered items', () => {
      expect(orderedList(['x', 'y'])).toBe('1. x\n2. y');
    });
  });

  describe('codeBlock', () => {
    it('wraps text in fences', () => {
      expect(codeBlock('hello', 'ts')).toBe('```ts\nhello\n```');
    });

    it('defaults to no language', () => {
      expect(codeBlock('hi')).toBe('```\nhi\n```');
    });
  });

  describe('blockquote', () => {
    it('prefixes each line with >', () => {
      expect(blockquote('line1\nline2')).toBe('> line1\n> line2');
    });
  });

  describe('bold / italic / link', () => {
    it('bold wraps in **', () => expect(bold('hi')).toBe('**hi**'));
    it('italic wraps in _', () => expect(italic('hi')).toBe('_hi_'));
    it('link renders markdown hyperlink', () => {
      expect(link('GitHub', 'https://github.com')).toBe('[GitHub](https://github.com)');
    });
  });

  describe('joinSections', () => {
    it('joins non-empty sections with blank lines', () => {
      expect(joinSections('a', '', 'b')).toBe('a\n\nb');
    });
  });

  describe('table', () => {
    it('renders a two-column table', () => {
      const result = table(['Key', 'Value'], [['foo', 'bar'], ['baz', 'qux']]);
      expect(result).toContain('| Key | Value |');
      expect(result).toContain('| --- | --- |');
      expect(result).toContain('| foo | bar |');
    });
  });
});
