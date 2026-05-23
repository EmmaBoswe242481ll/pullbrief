import { groupCommitsByType } from '../commits/parser';
import { deduplicateCommitMessages } from './deduplicator';
import { truncateArray } from './truncator';
import { bulletList, heading } from './markdown';
import { pluralize } from './pluralizer';

export interface ChangelogSection {
  type: string;
  label: string;
  entries: string[];
}

export interface ChangelogOptions {
  maxEntriesPerSection?: number;
  includeMergeCommits?: boolean;
}

const TYPE_LABELS: Record<string, string> = {
  feat: '🚀 Features',
  fix: '🐛 Bug Fixes',
  docs: '📝 Documentation',
  refactor: '♻️ Refactoring',
  test: '✅ Tests',
  chore: '🔧 Chores',
  perf: '⚡ Performance',
  style: '💄 Style',
  ci: '👷 CI',
};

export function buildChangelogSections(
  messages: string[],
  options: ChangelogOptions = {}
): ChangelogSection[] {
  const { maxEntriesPerSection = 20, includeMergeCommits = false } = options;

  const filtered = includeMergeCommits
    ? messages
    : messages.filter((m) => !m.startsWith('Merge'));

  const deduplicated = deduplicateCommitMessages(filtered);
  const grouped = groupCommitsByType(deduplicated);

  return Object.entries(grouped)
    .filter(([, entries]) => entries.length > 0)
    .map(([type, entries]) => ({
      type,
      label: TYPE_LABELS[type] ?? `📦 ${type}`,
      entries: truncateArray(entries, maxEntriesPerSection),
    }));
}

export function formatChangelogMarkdown(
  sections: ChangelogSection[],
  prTitle?: string
): string {
  if (sections.length === 0) return '_No categorized changes found._';

  const totalEntries = sections.reduce((sum, s) => sum + s.entries.length, 0);
  const lines: string[] = [];

  if (prTitle) {
    lines.push(heading(2, prTitle));
  }

  lines.push(
    `_${totalEntries} ${pluralize(totalEntries, 'change', 'changes')} across ${sections.length} ${pluralize(sections.length, 'category', 'categories')}_`,
    ''
  );

  for (const section of sections) {
    lines.push(heading(3, section.label));
    lines.push(bulletList(section.entries));
    lines.push('');
  }

  return lines.join('\n').trimEnd();
}
