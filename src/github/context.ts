import * as core from '@actions/core';
import * as github from '@actions/github';

export interface PullRequestContext {
  owner: string;
  repo: string;
  pullNumber: number;
  baseSha: string;
  headSha: string;
  title: string;
  body: string | null;
  author: string;
  baseRef: string;
  headRef: string;
}

export function getPullRequestContext(): PullRequestContext {
  const { context } = github;

  if (context.eventName !== 'pull_request') {
    throw new Error(`Expected pull_request event, got: ${context.eventName}`);
  }

  const pr = context.payload.pull_request;
  if (!pr) {
    throw new Error('No pull_request payload found in context');
  }

  return {
    owner: context.repo.owner,
    repo: context.repo.repo,
    pullNumber: pr.number,
    baseSha: pr.base.sha,
    headSha: pr.head.sha,
    title: pr.title,
    body: pr.body ?? null,
    author: pr.user?.login ?? 'unknown',
    baseRef: pr.base.ref,
    headRef: pr.head.ref,
  };
}

export function getInputs() {
  return {
    githubToken: core.getInput('github-token', { required: true }),
    templatePath: core.getInput('template-path') || undefined,
    updateBody: core.getBooleanInput('update-body'),
    outputFile: core.getInput('output-file') || undefined,
  };
}
