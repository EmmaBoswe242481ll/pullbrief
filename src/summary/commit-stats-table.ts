/**
 * Builds a markdown table summarising commit statistics for a PR summary.
 */

import { formatMarkdownTable, formatCountTable } from '../utils/table-formatter';
import type { GroupedCommits } from '../commits/parser';

export interface CommitStatsSummary {
  totalCommits: number;
  byType: Array<{ label: string; count: number }>;
  authors: string[];
}

export function buildCommitStatsTable(stats: CommitStatsSummary): string {
  const { totalCommits, byType, authors } = stats;

  const overviewTable = formatMarkdownTable({
    columns: [
      { header: 'Metric', align: 'left' },
      { header: 'Value', align: 'right' },
    ],
    rows: [
      ['Total commits', String(totalCommits)],
      ['Commit types', String(byType.length)],
      ['Contributors', String(authors.length)],
    ],
  });

  const typeTable = formatCountTable(byType, 'Commit Type');

  return [
    '### Commit Statistics',
    '',
    overviewTable,
    '',
    '#### By Type',
    '',
    typeTable,
  ].join('\n');
}

export function deriveCommitStats(
  grouped: GroupedCommits,
  authors: string[],
): CommitStatsSummary {
  const byType = Object.entries(grouped).map(([label, commits]) => ({
    label,
    count: commits.length,
  }));

  const totalCommits = byType.reduce((sum, { count }) => sum + count, 0);

  return { totalCommits, byType, authors };
}
