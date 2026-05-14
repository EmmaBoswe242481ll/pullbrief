export interface ParsedCommit {
  hash: string;
  shortHash: string;
  author: string;
  date: string;
  subject: string;
  type: string | null;
  scope: string | null;
  breaking: boolean;
}

const CONVENTIONAL_COMMIT_REGEX =
  /^(?<type>feat|fix|docs|style|refactor|perf|test|chore|build|ci|revert)(?:\((?<scope>[^)]+)\))?(?<breaking>!)?:\s(?<subject>.+)$/;

export function parseCommitMessage(raw: string): Pick<ParsedCommit, 'type' | 'scope' | 'breaking' | 'subject'> {
  const match = raw.trim().match(CONVENTIONAL_COMMIT_REGEX);

  if (!match || !match.groups) {
    return { type: null, scope: null, breaking: false, subject: raw.trim() };
  }

  const { type, scope, breaking, subject } = match.groups;
  return {
    type: type ?? null,
    scope: scope ?? null,
    breaking: breaking === '!',
    subject: subject ?? raw.trim(),
  };
}

export function parseCommitLine(line: string): ParsedCommit | null {
  // Expected format: "<hash> <author> <date> <message>"
  // e.g. "abc1234 Jane Doe 2024-01-15 feat(auth): add login"
  const parts = line.match(/^([a-f0-9]{7,40})\s+(.+?)\s+(\d{4}-\d{2}-\d{2})\s+(.+)$/);
  if (!parts) return null;

  const [, hash, author, date, rawMessage] = parts;
  const parsed = parseCommitMessage(rawMessage);

  return {
    hash,
    shortHash: hash.slice(0, 7),
    author,
    date,
    ...parsed,
  };
}

export function groupCommitsByType(commits: ParsedCommit[]): Record<string, ParsedCommit[]> {
  return commits.reduce<Record<string, ParsedCommit[]>>((acc, commit) => {
    const key = commit.type ?? 'other';
    if (!acc[key]) acc[key] = [];
    acc[key].push(commit);
    return acc;
  }, {});
}
