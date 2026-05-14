import { ParsedCommit } from './parser';

export interface CollectOptions {
  types?: string[];
  authors?: string[];
  excludeScopes?: string[];
}

/**
 * Filters and returns commits based on optional criteria.
 */
export function collectCommits(
  commits: ParsedCommit[],
  options: CollectOptions = {}
): ParsedCommit[] {
  let result = [...commits];

  if (options.types && options.types.length > 0) {
    result = result.filter(c => options.types!.includes(c.type));
  }

  if (options.authors && options.authors.length > 0) {
    result = result.filter(c => options.authors!.includes(c.author));
  }

  if (options.excludeScopes && options.excludeScopes.length > 0) {
    result = result.filter(
      c => !c.scope || !options.excludeScopes!.includes(c.scope)
    );
  }

  return result;
}

/**
 * Extracts a deduplicated list of commit authors.
 */
export function extractAuthors(commits: ParsedCommit[]): string[] {
  const seen = new Set<string>();
  for (const commit of commits) {
    if (commit.author) {
      seen.add(commit.author);
    }
  }
  return Array.from(seen);
}

/**
 * Returns only commits that contain breaking changes.
 */
export function extractBreakingChanges(commits: ParsedCommit[]): ParsedCommit[] {
  return commits.filter(c => c.breaking === true);
}

/**
 * Groups commits by author for attribution in summaries.
 */
export function groupCommitsByAuthor(
  commits: ParsedCommit[]
): Record<string, ParsedCommit[]> {
  return commits.reduce<Record<string, ParsedCommit[]>>((acc, commit) => {
    const author = commit.author || 'unknown';
    if (!acc[author]) {
      acc[author] = [];
    }
    acc[author].push(commit);
    return acc;
  }, {});
}
