/**
 * Deduplicator utility — removes duplicate entries from arrays of strings
 * or objects based on a key selector, preserving first-occurrence order.
 */

export function deduplicateStrings(items: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const item of items) {
    const normalized = item.trim();
    if (normalized && !seen.has(normalized)) {
      seen.add(normalized);
      result.push(normalized);
    }
  }
  return result;
}

export function deduplicateBy<T>(
  items: T[],
  keySelector: (item: T) => string
): T[] {
  const seen = new Set<string>();
  const result: T[] = [];
  for (const item of items) {
    const key = keySelector(item);
    if (!seen.has(key)) {
      seen.add(key);
      result.push(item);
    }
  }
  return result;
}

export function deduplicateCommitMessages(messages: string[]): string[] {
  return deduplicateStrings(
    messages.map((m) => m.replace(/^[a-f0-9]{7,40}\s+/i, "").trim())
  );
}

export function countDuplicates(items: string[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) {
    const normalized = item.trim();
    counts.set(normalized, (counts.get(normalized) ?? 0) + 1);
  }
  return counts;
}
