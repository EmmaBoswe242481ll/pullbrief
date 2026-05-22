/**
 * Fetches commits for a pull request using paginated GitHub API calls.
 */

import { Octokit } from "@octokit/rest";
import { fetchAllPages } from "../utils/paginator";
import { PaginationOptions } from "../utils/paginator";

export interface RawCommit {
  sha: string;
  message: string;
  author: string;
  date: string;
}

export interface FetchCommitsOptions extends PaginationOptions {
  owner: string;
  repo: string;
  pullNumber: number;
}

/**
 * Fetches all commits from a pull request, handling pagination automatically.
 */
export async function fetchPullRequestCommits(
  octokit: Octokit,
  options: FetchCommitsOptions
): Promise<RawCommit[]> {
  const { owner, repo, pullNumber, ...paginationOptions } = options;

  const raw = await fetchAllPages(
    async (page, per_page) => {
      const response = await octokit.rest.pulls.listCommits({
        owner,
        repo,
        pull_number: pullNumber,
        page,
        per_page,
      });
      return response.data;
    },
    { perPage: 100, ...paginationOptions }
  );

  return raw.map((commit) => ({
    sha: commit.sha,
    message: commit.commit.message,
    author: commit.commit.author?.name ?? "unknown",
    date: commit.commit.author?.date ?? "",
  }));
}

/**
 * Extracts the short SHA (first 7 characters) from a full commit SHA.
 */
export function shortSha(sha: string): string {
  return sha.slice(0, 7);
}
