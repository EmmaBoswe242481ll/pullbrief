import { collectCommits } from '../commits/collector';
import { buildChangelogSections, formatChangelogMarkdown, ChangelogOptions } from '../utils/changelog';
import { log } from '../utils/logger';
import { wrapError } from '../utils/errors';

export interface ChangelogBuildResult {
  markdown: string;
  sectionCount: number;
  totalEntries: number;
  skipped: boolean;
}

export interface ChangelogBuildInput {
  owner: string;
  repo: string;
  base: string;
  head: string;
  prTitle?: string;
  options?: ChangelogOptions;
}

export async function buildPRChangelog(
  input: ChangelogBuildInput,
  fetchCommits: (owner: string, repo: string, base: string, head: string) => Promise<string[]>
): Promise<ChangelogBuildResult> {
  const { owner, repo, base, head, prTitle, options } = input;

  let messages: string[];
  try {
    messages = await fetchCommits(owner, repo, base, head);
    log('debug', `Fetched ${messages.length} commit messages for changelog`);
  } catch (err) {
    throw wrapError(err, 'Failed to fetch commits for changelog generation');
  }

  if (messages.length === 0) {
    log('info', 'No commits found; skipping changelog generation');
    return { markdown: '', sectionCount: 0, totalEntries: 0, skipped: true };
  }

  const sections = buildChangelogSections(messages, options);
  const totalEntries = sections.reduce((sum, s) => sum + s.entries.length, 0);
  const markdown = formatChangelogMarkdown(sections, prTitle);

  log('info', `Changelog built: ${sections.length} sections, ${totalEntries} entries`);

  return {
    markdown,
    sectionCount: sections.length,
    totalEntries,
    skipped: false,
  };
}
