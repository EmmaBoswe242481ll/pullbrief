import { execSync } from 'child_process';
import { parseCommitLine, ParsedCommit } from './parser';

export interface CollectorOptions {
  base?: string;
  head?: string;
  repoPath?: string;
}

/**
 * Runs `git log` to collect commits between two refs.
 * Falls back to the last 20 commits if no base/head are provided.
 */
export function collectCommits(options: CollectorOptions = {}): ParsedCommit[] {
  const { base, head = 'HEAD', repoPath = process.cwd() } = options;

  const range = base ? `${base}...${head}` : `-20 ${head}`;
  const format = '--pretty=format:%H %an %as %s';

  let output: string;
  try {
    output = execSync(`git log ${range} ${format}`, {
      cwd: repoPath,
      encoding: 'utf-8',
    }).trim();
  } catch (err) {
    throw new Error(`Failed to collect commits: ${(err as Error).message}`);
  }

  if (!output) return [];

  return output
    .split('\n')
    .map((line) => parseCommitLine(line.trim()))
    .filter((c): c is ParsedCommit => c !== null);
}

/**
 * Collects unique authors from a list of parsed commits.
 */
export function extractAuthors(commits: ParsedCommit[]): string[] {
  const seen = new Set<string>();
  return commits
    .map((c) => c.author)
    .filter((author) => {
      if (seen.has(author)) return false;
      seen.add(author);
      return true;
    });
}

/**
 * Returns all commits flagged as breaking changes.
 */
export function extractBreakingChanges(commits: ParsedCommit[]): ParsedCommit[] {
  return commits.filter((c) => c.breaking);
}
