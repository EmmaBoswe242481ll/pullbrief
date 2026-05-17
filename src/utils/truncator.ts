/**
 * Utilities for truncating strings and arrays to safe limits
 * used across summary generation and template rendering.
 */

export const DEFAULT_MAX_LENGTH = 500;
export const DEFAULT_MAX_LINES = 20;
export const DEFAULT_ELLIPSIS = '...';

export interface TruncateOptions {
  maxLength?: number;
  ellipsis?: string;
  preserveWords?: boolean;
}

/**
 * Truncates a string to a maximum length, optionally preserving word boundaries.
 */
export function truncateString(input: string, options: TruncateOptions = {}): string {
  const {
    maxLength = DEFAULT_MAX_LENGTH,
    ellipsis = DEFAULT_ELLIPSIS,
    preserveWords = true,
  } = options;

  if (input.length <= maxLength) return input;

  const cutoff = maxLength - ellipsis.length;
  if (cutoff <= 0) return ellipsis.slice(0, maxLength);

  if (!preserveWords) {
    return input.slice(0, cutoff) + ellipsis;
  }

  const lastSpace = input.lastIndexOf(' ', cutoff);
  const end = lastSpace > 0 ? lastSpace : cutoff;
  return input.slice(0, end) + ellipsis;
}

/**
 * Truncates an array to a maximum number of items,
 * returning the kept items and a count of omitted ones.
 */
export function truncateArray<T>(
  items: T[],
  maxItems: number = DEFAULT_MAX_LINES
): { items: T[]; omitted: number } {
  if (items.length <= maxItems) {
    return { items, omitted: 0 };
  }
  return {
    items: items.slice(0, maxItems),
    omitted: items.length - maxItems,
  };
}

/**
 * Truncates a multiline string to a maximum number of lines.
 */
export function truncateLines(
  input: string,
  maxLines: number = DEFAULT_MAX_LINES,
  ellipsis: string = DEFAULT_ELLIPSIS
): string {
  const lines = input.split('\n');
  if (lines.length <= maxLines) return input;
  const kept = lines.slice(0, maxLines);
  kept.push(ellipsis);
  return kept.join('\n');
}
