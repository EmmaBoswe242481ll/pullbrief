import { parseCommitMessage, parseCommitLine, groupCommitsByType } from './parser';

describe('parseCommitMessage', () => {
  it('parses a conventional commit with type and subject', () => {
    const result = parseCommitMessage('feat: add user authentication');
    expect(result.type).toBe('feat');
    expect(result.scope).toBeNull();
    expect(result.breaking).toBe(false);
    expect(result.subject).toBe('add user authentication');
  });

  it('parses a conventional commit with scope', () => {
    const result = parseCommitMessage('fix(auth): resolve token expiry bug');
    expect(result.type).toBe('fix');
    expect(result.scope).toBe('auth');
    expect(result.subject).toBe('resolve token expiry bug');
  });

  it('detects breaking changes', () => {
    const result = parseCommitMessage('feat!: remove legacy API');
    expect(result.breaking).toBe(true);
    expect(result.type).toBe('feat');
  });

  it('handles non-conventional commit messages', () => {
    const result = parseCommitMessage('update readme');
    expect(result.type).toBeNull();
    expect(result.scope).toBeNull();
    expect(result.subject).toBe('update readme');
  });
});

describe('parseCommitLine', () => {
  it('parses a full commit log line', () => {
    const line = 'abc1234 Jane Doe 2024-01-15 feat(ui): add dark mode toggle';
    const result = parseCommitLine(line);
    expect(result).not.toBeNull();
    expect(result?.shortHash).toBe('abc1234');
    expect(result?.author).toBe('Jane Doe');
    expect(result?.date).toBe('2024-01-15');
    expect(result?.type).toBe('feat');
    expect(result?.scope).toBe('ui');
  });

  it('returns null for malformed lines', () => {
    expect(parseCommitLine('not a valid line')).toBeNull();
  });
});

describe('groupCommitsByType', () => {
  it('groups commits by their type', () => {
    const commits = [
      { hash: 'aaa', shortHash: 'aaa', author: 'A', date: '2024-01-01', subject: 'add x', type: 'feat', scope: null, breaking: false },
      { hash: 'bbb', shortHash: 'bbb', author: 'B', date: '2024-01-02', subject: 'fix y', type: 'fix', scope: null, breaking: false },
      { hash: 'ccc', shortHash: 'ccc', author: 'C', date: '2024-01-03', subject: 'add z', type: 'feat', scope: null, breaking: false },
    ];
    const grouped = groupCommitsByType(commits);
    expect(grouped['feat']).toHaveLength(2);
    expect(grouped['fix']).toHaveLength(1);
  });

  it('groups unknown types under "other"', () => {
    const commits = [
      { hash: 'ddd', shortHash: 'ddd', author: 'D', date: '2024-01-04', subject: 'misc change', type: null, scope: null, breaking: false },
    ];
    const grouped = groupCommitsByType(commits);
    expect(grouped['other']).toHaveLength(1);
  });
});
