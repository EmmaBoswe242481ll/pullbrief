import * as github from '@actions/github';
import type { PullRequestContext } from './context';

export type OctokitClient = ReturnType<typeof github.getOctokit>;

export interface PullRequestFile {
  filename: string;
  status: 'added' | 'removed' | 'modified' | 'renamed' | 'copied' | 'changed' | 'unchanged';
  additions: number;
  deletions: number;
  changes: number;
}

export async function fetchPullRequestFiles(
  octokit: OctokitClient,
  ctx: PullRequestContext
): Promise<PullRequestFile[]> {
  const { data } = await octokit.rest.pulls.listFiles({
    owner: ctx.owner,
    repo: ctx.repo,
    pull_number: ctx.pullNumber,
    per_page: 100,
  });

  return data.map((f) => ({
    filename: f.filename,
    status: f.status as PullRequestFile['status'],
    additions: f.additions,
    deletions: f.deletions,
    changes: f.changes,
  }));
}

export async function updatePullRequestBody(
  octokit: OctokitClient,
  ctx: PullRequestContext,
  body: string
): Promise<void> {
  await octokit.rest.pulls.update({
    owner: ctx.owner,
    repo: ctx.repo,
    pull_number: ctx.pullNumber,
    body,
  });
}

export async function fetchCommitMessages(
  octokit: OctokitClient,
  ctx: PullRequestContext
): Promise<string[]> {
  const { data } = await octokit.rest.pulls.listCommits({
    owner: ctx.owner,
    repo: ctx.repo,
    pull_number: ctx.pullNumber,
    per_page: 100,
  });

  return data.map((c) => c.commit.message);
}
