import {
  buildCommitLink,
  buildPullRequestLink,
  buildIssueLink,
  buildUserLink,
  buildFileLink,
  buildCompareLink,
  extractIssueReferences,
  linkifyIssueReferences,
} from './link-builder';

const REPO = 'https://github.com/owner/repo';

describe('buildCommitLink', () => {
  it('shortens sha to 7 chars and links to commit', () => {
    const result = buildCommitLink(REPO, 'abc1234567890');
    expect(result).toBe('[`abc1234`](https://github.com/owner/repo/commit/abc1234567890)');
  });
});

describe('buildPullRequestLink', () => {
  it('uses number as label when no title provided', () => {
    expect(buildPullRequestLink(REPO, 42)).toBe('[#42](https://github.com/owner/repo/pull/42)');
  });

  it('uses title as label when provided', () => {
    expect(buildPullRequestLink(REPO, 42, 'My Feature')).toBe(
      '[My Feature](https://github.com/owner/repo/pull/42)'
    );
  });
});

describe('buildIssueLink', () => {
  it('builds issue link', () => {
    expect(buildIssueLink(REPO, 7)).toBe('[#7](https://github.com/owner/repo/issues/7)');
  });
});

describe('buildUserLink', () => {
  it('builds user mention link', () => {
    expect(buildUserLink('octocat')).toBe('[@octocat](https://github.com/octocat)');
  });
});

describe('buildFileLink', () => {
  it('links to file at given ref', () => {
    expect(buildFileLink(REPO, 'src/index.ts', 'main')).toBe(
      '[`src/index.ts`](https://github.com/owner/repo/blob/main/src/index.ts)'
    );
  });
});

describe('buildCompareLink', () => {
  it('builds compare URL', () => {
    expect(buildCompareLink(REPO, 'main', 'feature')).toBe(
      '[main...feature](https://github.com/owner/repo/compare/main...feature)'
    );
  });
});

describe('extractIssueReferences', () => {
  it('extracts plain issue numbers', () => {
    expect(extractIssueReferences('fixes #12 and closes #34')).toEqual([12, 34]);
  });

  it('deduplicates references', () => {
    expect(extractIssueReferences('#5 and #5 again')).toEqual([5]);
  });

  it('returns empty array when no references', () => {
    expect(extractIssueReferences('no issues here')).toEqual([]);
  });
});

describe('linkifyIssueReferences', () => {
  it('replaces #N with markdown links', () => {
    const result = linkifyIssueReferences('Fixes #10', REPO);
    expect(result).toBe('Fixes [#10](https://github.com/owner/repo/issues/10)');
  });
});
