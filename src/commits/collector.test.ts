import { collectCommits, extractAuthors, extractBreakingChanges } from './collector';
import { ParsedCommit } from './parser';

const mockCommits: ParsedCommit[] = [
  {
    hash: 'abc1234',
    type: 'feat',
    scope: 'auth',
    subject: 'add OAuth2 login support',
    body: 'Implements OAuth2 flow for GitHub and Google providers.',
    breaking: false,
    author: 'alice',
    raw: 'feat(auth): add OAuth2 login support'
  },
  {
    hash: 'def5678',
    type: 'fix',
    scope: 'api',
    subject: 'correct rate limit headers',
    body: '',
    breaking: false,
    author: 'bob',
    raw: 'fix(api): correct rate limit headers'
  },
  {
    hash: 'ghi9012',
    type: 'feat',
    scope: null,
    subject: 'redesign dashboard layout',
    body: 'BREAKING CHANGE: removes legacy widget API',
    breaking: true,
    author: 'alice',
    raw: 'feat!: redesign dashboard layout'
  }
];

describe('collectCommits', () => {
  it('returns all commits when no filter applied', () => {
    const result = collectCommits(mockCommits);
    expect(result).toHaveLength(3);
  });

  it('filters commits by type', () => {
    const result = collectCommits(mockCommits, { types: ['feat'] });
    expect(result).toHaveLength(2);
    expect(result.every(c => c.type === 'feat')).toBe(true);
  });

  it('filters commits by author', () => {
    const result = collectCommits(mockCommits, { authors: ['bob'] });
    expect(result).toHaveLength(1);
    expect(result[0].author).toBe('bob');
  });
});

describe('extractAuthors', () => {
  it('returns unique authors from commits', () => {
    const authors = extractAuthors(mockCommits);
    expect(authors).toEqual(expect.arrayContaining(['alice', 'bob']));
    expect(authors).toHaveLength(2);
  });

  it('returns empty array for no commits', () => {
    expect(extractAuthors([])).toEqual([]);
  });
});

describe('extractBreakingChanges', () => {
  it('returns only breaking commits', () => {
    const breaking = extractBreakingChanges(mockCommits);
    expect(breaking).toHaveLength(1);
    expect(breaking[0].hash).toBe('ghi9012');
  });

  it('returns empty array when no breaking changes', () => {
    const nonBreaking = mockCommits.filter(c => !c.breaking);
    expect(extractBreakingChanges(nonBreaking)).toEqual([]);
  });
});
