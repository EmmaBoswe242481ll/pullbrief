import { fetchPullRequestFiles, fetchCommitMessages, updatePullRequestBody } from './client';
import type { PullRequestContext } from './context';

const mockCtx: PullRequestContext = {
  owner: 'acme',
  repo: 'my-repo',
  pullNumber: 7,
  baseSha: 'base-sha',
  headSha: 'head-sha',
  title: 'chore: update deps',
  body: null,
  author: 'dev',
  baseRef: 'main',
  headRef: 'chore/deps',
};

const makeOctokit = (overrides = {}) => ({
  rest: {
    pulls: {
      listFiles: jest.fn().mockResolvedValue({
        data: [
          { filename: 'src/index.ts', status: 'modified', additions: 5, deletions: 2, changes: 7 },
        ],
      }),
      listCommits: jest.fn().mockResolvedValue({
        data: [
          { commit: { message: 'fix: resolve issue\n\nDetails here' } },
          { commit: { message: 'chore: bump version' } },
        ],
      }),
      update: jest.fn().mockResolvedValue({}),
      ...overrides,
    },
  },
});

describe('fetchPullRequestFiles', () => {
  it('returns mapped file list', async () => {
    const octokit = makeOctokit() as any;
    const files = await fetchPullRequestFiles(octokit, mockCtx);
    expect(files).toHaveLength(1);
    expect(files[0].filename).toBe('src/index.ts');
    expect(files[0].status).toBe('modified');
    expect(files[0].additions).toBe(5);
  });
});

describe('fetchCommitMessages', () => {
  it('returns list of commit messages', async () => {
    const octokit = makeOctokit() as any;
    const messages = await fetchCommitMessages(octokit, mockCtx);
    expect(messages).toHaveLength(2);
    expect(messages[0]).toBe('fix: resolve issue\n\nDetails here');
  });
});

describe('updatePullRequestBody', () => {
  it('calls octokit update with correct params', async () => {
    const octokit = makeOctokit() as any;
    await updatePullRequestBody(octokit, mockCtx, '## Summary\nNew body');
    expect(octokit.rest.pulls.update).toHaveBeenCalledWith({
      owner: 'acme',
      repo: 'my-repo',
      pull_number: 7,
      body: '## Summary\nNew body',
    });
  });
});
