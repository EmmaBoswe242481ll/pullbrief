/**
 * differ.ts
 * Utilities for computing and formatting diffs between text content.
 */

export interface DiffResult {
  added: string[];
  removed: string[];
  unchanged: string[];
  addedCount: number;
  removedCount: number;
}

export interface DiffStats {
  totalAdded: number;
  totalRemoved: number;
  totalChanged: number;
  changeRatio: number;
}

/**
 * Compute a simple line-level diff between two text strings.
 */
export function diffLines(before: string, after: string): DiffResult {
  const beforeLines = before.split('\n');
  const afterLines = after.split('\n');

  const beforeSet = new Set(beforeLines);
  const afterSet = new Set(afterLines);

  const added = afterLines.filter((line) => !beforeSet.has(line));
  const removed = beforeLines.filter((line) => !afterSet.has(line));
  const unchanged = afterLines.filter((line) => beforeSet.has(line));

  return {
    added,
    removed,
    unchanged,
    addedCount: added.length,
    removedCount: removed.length,
  };
}

/**
 * Compute summary statistics from a DiffResult.
 */
export function computeDiffStats(diff: DiffResult): DiffStats {
  const totalChanged = diff.addedCount + diff.removedCount;
  const total = totalChanged + diff.unchanged.length;
  const changeRatio = total === 0 ? 0 : totalChanged / total;

  return {
    totalAdded: diff.addedCount,
    totalRemoved: diff.removedCount,
    totalChanged,
    changeRatio: Math.round(changeRatio * 100) / 100,
  };
}

/**
 * Format a DiffResult into a human-readable markdown snippet.
 */
export function formatDiffMarkdown(diff: DiffResult): string {
  const lines: string[] = [];

  if (diff.addedCount > 0) {
    lines.push(`**+${diff.addedCount} added**`);
    diff.added.slice(0, 5).forEach((l) => lines.push(`  \`+ ${l}\``));
    if (diff.addedCount > 5) lines.push(`  _...and ${diff.addedCount - 5} more_`);
  }

  if (diff.removedCount > 0) {
    lines.push(`**-${diff.removedCount} removed**`);
    diff.removed.slice(0, 5).forEach((l) => lines.push(`  \`- ${l}\``));
    if (diff.removedCount > 5) lines.push(`  _...and ${diff.removedCount - 5} more_`);
  }

  return lines.join('\n');
}
