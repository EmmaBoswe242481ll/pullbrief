/**
 * Utility functions for sorting commits, files, and summary entries.
 */

export type SortOrder = 'asc' | 'desc';

export interface Sortable {
  [key: string]: unknown;
}

/**
 * Sort an array of strings alphabetically.
 */
export function sortStrings(items: string[], order: SortOrder = 'asc'): string[] {
  const sorted = [...items].sort((a, b) => a.localeCompare(b));
  return order === 'desc' ? sorted.reverse() : sorted;
}

/**
 * Sort an array of objects by a string key.
 */
export function sortByKey<T extends Sortable>(
  items: T[],
  key: keyof T,
  order: SortOrder = 'asc'
): T[] {
  const sorted = [...items].sort((a, b) => {
    const aVal = String(a[key] ?? '');
    const bVal = String(b[key] ?? '');
    return aVal.localeCompare(bVal);
  });
  return order === 'desc' ? sorted.reverse() : sorted;
}

/**
 * Sort an array of objects by a numeric key.
 */
export function sortByNumericKey<T extends Sortable>(
  items: T[],
  key: keyof T,
  order: SortOrder = 'desc'
): T[] {
  const sorted = [...items].sort((a, b) => {
    const aVal = Number(a[key] ?? 0);
    const bVal = Number(b[key] ?? 0);
    return aVal - bVal;
  });
  return order === 'desc' ? sorted.reverse() : sorted;
}

/**
 * Sort commit types by a predefined priority order.
 * Breaking changes and features appear first.
 */
const TYPE_PRIORITY: Record<string, number> = {
  'breaking': 0,
  'feat': 1,
  'fix': 2,
  'perf': 3,
  'refactor': 4,
  'docs': 5,
  'test': 6,
  'chore': 7,
  'ci': 8,
  'build': 9,
};

export function sortCommitTypes(types: string[]): string[] {
  return [...types].sort((a, b) => {
    const aPriority = TYPE_PRIORITY[a] ?? 99;
    const bPriority = TYPE_PRIORITY[b] ?? 99;
    return aPriority - bPriority;
  });
}

/**
 * Stable sort — preserves original order for equal elements.
 */
export function stableSort<T>(
  items: T[],
  compareFn: (a: T, b: T) => number
): T[] {
  return items
    .map((item, index) => ({ item, index }))
    .sort((a, b) => compareFn(a.item, b.item) || a.index - b.index)
    .map(({ item }) => item);
}
