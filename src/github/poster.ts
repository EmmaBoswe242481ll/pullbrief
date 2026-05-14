import * as core from '@actions/core';
import * as github from '@actions/github';

export interface PostCommentOptions {
  token: string;
  owner: string;
  repo: string;
  pullNumber: number;
  body: string;
}

export interface UpdateCommentOptions extends PostCommentOptions {
  commentId?: number;
}

const COMMENT_MARKER = '<!-- pullbrief-summary -->';

export async function postOrUpdatePRComment(
  options: UpdateCommentOptions
): Promise<number> {
  const octokit = github.getOctokit(options.token);

  const existingId = options.commentId ?? (await findExistingComment(octokit, options));

  const body = `${COMMENT_MARKER}\n${options.body}`;

  if (existingId) {
    core.info(`Updating existing PR comment #${existingId}`);
    const { data } = await octokit.rest.issues.updateComment({
      owner: options.owner,
      repo: options.repo,
      comment_id: existingId,
      body,
    });
    return data.id;
  }

  core.info(`Creating new PR comment on PR #${options.pullNumber}`);
  const { data } = await octokit.rest.issues.createComment({
    owner: options.owner,
    repo: options.repo,
    issue_number: options.pullNumber,
    body,
  });
  return data.id;
}

async function findExistingComment(
  octokit: ReturnType<typeof github.getOctokit>,
  options: PostCommentOptions
): Promise<number | undefined> {
  const comments = await octokit.rest.issues.listComments({
    owner: options.owner,
    repo: options.repo,
    issue_number: options.pullNumber,
  });

  const found = comments.data.find((c) => c.body?.includes(COMMENT_MARKER));
  return found?.id;
}
