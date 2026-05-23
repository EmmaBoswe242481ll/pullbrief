import { slugify, uniqueSlug, headingAnchor, slugifyAll } from './slugifier';

describe('slugify', () => {
  it('lowercases the input', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('replaces spaces with hyphens', () => {
    expect(slugify('foo bar baz')).toBe('foo-bar-baz');
  });

  it('collapses consecutive non-alphanumeric chars into a single hyphen', () => {
    expect(slugify('feat: Add OAuth2 support!')).toBe('feat-add-oauth2-support');
  });

  it('strips leading and trailing hyphens', () => {
    expect(slugify('  --hello--  ')).toBe('hello');
  });

  it('handles an empty string', () => {
    expect(slugify('')).toBe('');
  });

  it('preserves numbers', () => {
    expect(slugify('v1.2.3 release')).toBe('v1-2-3-release');
  });
});

describe('uniqueSlug', () => {
  it('returns the base slug when not yet seen', () => {
    const seen = new Set<string>();
    expect(uniqueSlug('fixes', seen)).toBe('fixes');
  });

  it('appends -1 on the first collision', () => {
    const seen = new Set<string>(['fixes']);
    expect(uniqueSlug('fixes', seen)).toBe('fixes-1');
  });

  it('increments counter on subsequent collisions', () => {
    const seen = new Set<string>(['fixes', 'fixes-1']);
    expect(uniqueSlug('fixes', seen)).toBe('fixes-2');
  });

  it('mutates the seen set so subsequent calls stay unique', () => {
    const seen = new Set<string>();
    uniqueSlug('breaking-changes', seen);
    uniqueSlug('breaking-changes', seen);
    const third = uniqueSlug('breaking-changes', seen);
    expect(third).toBe('breaking-changes-2');
    expect(seen.size).toBe(3);
  });
});

describe('headingAnchor', () => {
  it('prefixes the slug with #', () => {
    expect(headingAnchor('Breaking Changes')).toBe('#breaking-changes');
  });

  it('handles special characters in headings', () => {
    expect(headingAnchor('feat(scope): New Feature')).toBe('#feat-scope-new-feature');
  });
});

describe('slugifyAll', () => {
  it('returns unique slugs for duplicate inputs', () => {
    const result = slugifyAll(['Fixes', 'Fixes', 'Fixes']);
    expect(result).toEqual(['fixes', 'fixes-1', 'fixes-2']);
  });

  it('returns an empty array for empty input', () => {
    expect(slugifyAll([])).toEqual([]);
  });

  it('does not mutate the input array', () => {
    const inputs = ['Alpha', 'Beta'];
    slugifyAll(inputs);
    expect(inputs).toEqual(['Alpha', 'Beta']);
  });
});
