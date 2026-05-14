import { ParsedCommit, CommitGroup } from '../commits/parser';
import { FileSummary } from '../files/summarizer';

export interface FormatterOptions {
  includeAuthors?: boolean;
  includeBreakingChanges?: boolean;
  maxCommitsPerGroup?: number;
}

export interface FormattedSummary {
  title: string;
  sections: FormattedSection[];
  metadata: SummaryMetadata;
}

export interface FormattedSection {
  heading: string;
  items: string[];
}

export interface SummaryMetadata {
  totalCommits: number;
  totalFilesChanged: number;
  hasBreakingChanges: boolean;
  authors: string[];
}

export function formatSummary(
  commitGroups: CommitGroup[],
  fileSummary: FileSummary,
  options: FormatterOptions = {}
): FormattedSummary {
  const { includeAuthors = true, includeBreakingChanges = true, maxCommitsPerGroup = 10 } = options;

  const sections: FormattedSection[] = [];
  let totalCommits = 0;
  let hasBreakingChanges = false;
  const authorSet = new Set<string>();

  for (const group of commitGroups) {
    const items = group.commits
      .slice(0, maxCommitsPerGroup)
      .map((c) => {
        if (c.author) authorSet.add(c.author);
        if (c.breaking) hasBreakingChanges = true;
        totalCommits++;
        return `- ${c.subject}${c.scope ? ` (${c.scope})` : ''}`;
      });

    if (items.length > 0) {
      sections.push({ heading: formatGroupHeading(group.type), items });
    }
  }

  if (includeBreakingChanges && hasBreakingChanges) {
    const breakingItems = commitGroups
      .flatMap((g) => g.commits)
      .filter((c) => c.breaking)
      .map((c) => `- ⚠️ ${c.subject}`);
    if (breakingItems.length > 0) {
      sections.unshift({ heading: '🚨 Breaking Changes', items: breakingItems });
    }
  }

  if (fileSummary.highlights.length > 0) {
    sections.push({ heading: '📁 Changed Files', items: fileSummary.highlights.map((h) => `- ${h}`) });
  }

  const authors = includeAuthors ? Array.from(authorSet) : [];

  return {
    title: buildTitle(commitGroups),
    sections,
    metadata: {
      totalCommits,
      totalFilesChanged: fileSummary.totalCount,
      hasBreakingChanges,
      authors,
    },
  };
}

function formatGroupHeading(type: string): string {
  const headings: Record<string, string> = {
    feat: '✨ Features',
    fix: '🐛 Bug Fixes',
    docs: '📝 Documentation',
    chore: '🔧 Chores',
    refactor: '♻️ Refactoring',
    test: '✅ Tests',
    perf: '⚡ Performance',
    style: '💄 Style',
    ci: '👷 CI',
  };
  return headings[type] ?? `📌 ${type.charAt(0).toUpperCase() + type.slice(1)}`;
}

function buildTitle(groups: CommitGroup[]): string {
  const types = groups.map((g) => g.type);
  if (types.includes('feat')) return 'Feature Release';
  if (types.includes('fix')) return 'Bug Fix Release';
  if (types.includes('refactor')) return 'Refactoring Update';
  return 'Maintenance Update';
}
