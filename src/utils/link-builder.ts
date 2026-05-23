/**
 * Utilities for building GitHub-flavored markdown links and PR-related URLs.
 */

export function buildCommitLink(repoUrl: string, sha: string): string {
  const short = sha.slice(0, 7);
  return `[\`${short}\`](${repoUrl}/commit/${sha})`;
}

export function buildPullRequestLink(repoUrl: string, prNumber: number, title?: string): string {
  const label = title ? title : `#${prNumber}`;
  return `[${label}](${repoUrl}/pull/${prNumber})`;
}

export function buildIssueLink(repoUrl: string, issueNumber: number): string {
  return `[#${issueNumber}](${repoUrl}/issues/${issueNumber})`;
}

export function buildUserLink(username: string): string {
  return `[@${username}](https://github.com/${username})`;
}

export function buildFileLink(repoUrl: string, filePath: string, ref: string): string {
  return `[\`${filePath}\`](${repoUrl}/blob/${ref}/${filePath})`;
}

export function buildCompareLink(repoUrl: string, base: string, head: string): string {
  return `[${base}...${head}](${repoUrl}/compare/${base}...${head})`;
}

export function extractIssueReferences(text: string): number[] {
  const pattern = /(?:closes?|fixes?|resolves?)?\s*#(\d+)/gi;
  const matches = [...text.matchAll(pattern)];
  return [...new Set(matches.map((m) => parseInt(m[1], 10)))];
}

export function linkifyIssueReferences(text: string, repoUrl: string): string {
  return text.replace(/#(\d+)/g, (_, num) => buildIssueLink(repoUrl, parseInt(num, 10)));
}
