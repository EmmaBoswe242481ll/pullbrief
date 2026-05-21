/**
 * differ-integration.ts
 * Integrates the differ utility with PR summary generation,
 * computing diffs between old and new PR body content.
 */

import { diffLines, computeDiffStats, formatDiffMarkdown, DiffStats } from '../utils/differ';

export interface SummaryDiffReport {
  hasChanges: boolean;
  stats: DiffStats;
  markdownSummary: string;
  previousLength: number;
  currentLength: number;
}

/**
 * Compare a previous PR body to a newly generated summary and
 * produce a structured report describing what changed.
 */
export function compareSummaries(
  previousBody: string,
  currentBody: string
): SummaryDiffReport {
  const diff = diffLines(previousBody, currentBody);
  const stats = computeDiffStats(diff);
  const markdownSummary = formatDiffMarkdown(diff);

  return {
    hasChanges: stats.totalChanged > 0,
    stats,
    markdownSummary,
    previousLength: previousBody.length,
    currentLength: currentBody.length,
  };
}

/**
 * Determine whether a PR body should be updated based on the diff report.
 * Avoids no-op updates when content is effectively the same.
 */
export function shouldUpdatePRBody(report: SummaryDiffReport): boolean {
  if (!report.hasChanges) return false;
  // Ignore purely whitespace-level changes by comparing trimmed lengths
  if (Math.abs(report.currentLength - report.previousLength) < 3) return false;
  return true;
}

/**
 * Build a concise changelog note to append to the PR body when updating,
 * so reviewers can see what changed in the summary itself.
 */
export function buildDiffChangelogNote(report: SummaryDiffReport): string {
  if (!report.hasChanges) return '';

  const { totalAdded, totalRemoved, changeRatio } = report.stats;
  const pct = Math.round(changeRatio * 100);

  const lines = [
    `> **Summary updated** — ${pct}% of content changed`,
    `> +${totalAdded} lines added, -${totalRemoved} lines removed`,
  ];

  if (report.markdownSummary) {
    lines.push('', '<details><summary>Diff details</summary>', '', report.markdownSummary, '</details>');
  }

  return lines.join('\n');
}
