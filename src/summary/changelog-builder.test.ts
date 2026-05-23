import { buildPRChangelog } from './changelog-builder';

const makeInput = (overrides = {}) => ({
  owner: 'acme',
  repo: 'pullbrief',
  base: 'main',
  head: 'feature/x',
  prTitle: 'My Feature PR',
  ...overrides,
});

const mockFetch = (messages: string[]) =>
  jest.fn().mockResolvedValue(messages);

describe('buildPRChangelog', () => {
  it('returns skipped result when no commits', async () => {
    const result = await buildPRChangelog(makeInput(), mockFetch([]));
    expect(result.skipped).toBe(true);
    expect(result.markdown).toBe('');
    expect(result.totalEntries).toBe(0);
  });

  it('builds changelog from commits', async () => {
    const commits = ['feat: add search', 'fix: correct typo', 'docs: update guide'];
    const result = await buildPRChangelog(makeInput(), mockFetch(commits));
    expect(result.skipped).toBe(false);
    expect(result.sectionCount).toBeGreaterThan(0);
    expect(result.totalEntries).toBe(3);
    expect(result.markdown).toContain('My Feature PR');
  });

  it('passes options to section builder', async () => {
    const commits = Array.from({ length: 10 }, (_, i) => `feat: feature ${i}`);
    const result = await buildPRChangelog(
      makeInput({ options: { maxEntriesPerSection: 3 } }),
      mockFetch(commits)
    );
    expect(result.totalEntries).toBeLessThanOrEqual(3);
  });

  it('wraps fetch errors', async () => {
    const failFetch = jest.fn().mockRejectedValue(new Error('network failure'));
    await expect(buildPRChangelog(makeInput(), failFetch)).rejects.toThrow(
      'Failed to fetch commits for changelog generation'
    );
  });

  it('calls fetchCommits with correct args', async () => {
    const fetch = mockFetch(['feat: something']);
    await buildPRChangelog(makeInput(), fetch);
    expect(fetch).toHaveBeenCalledWith('acme', 'pullbrief', 'main', 'feature/x');
  });

  it('returns markdown with section headings', async () => {
    const commits = ['feat: new feature', 'fix: bug fix'];
    const result = await buildPRChangelog(makeInput(), mockFetch(commits));
    expect(result.markdown).toMatch(/#{2,3}/);
  });
});
