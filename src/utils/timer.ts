/**
 * Utility for measuring execution time of async operations.
 */

export interface TimingResult<T> {
  value: T;
  durationMs: number;
}

export interface TimerEntry {
  label: string;
  startedAt: number;
  endedAt?: number;
  durationMs?: number;
}

const timings: TimerEntry[] = [];

/**
 * Wraps an async function and records its execution time.
 */
export async function withTiming<T>(
  label: string,
  fn: () => Promise<T>
): Promise<TimingResult<T>> {
  const startedAt = Date.now();
  const entry: TimerEntry = { label, startedAt };
  timings.push(entry);

  try {
    const value = await fn();
    const endedAt = Date.now();
    entry.endedAt = endedAt;
    entry.durationMs = endedAt - startedAt;
    return { value, durationMs: entry.durationMs };
  } catch (err) {
    const endedAt = Date.now();
    entry.endedAt = endedAt;
    entry.durationMs = endedAt - startedAt;
    throw err;
  }
}

/**
 * Returns a copy of all recorded timing entries.
 */
export function getTimings(): TimerEntry[] {
  return [...timings];
}

/**
 * Clears all recorded timing entries.
 */
export function clearTimings(): void {
  timings.length = 0;
}

/**
 * Formats all recorded timings into a human-readable markdown table.
 */
export function formatTimingsMarkdown(): string {
  if (timings.length === 0) return '_No timings recorded._';

  const rows = timings
    .filter((t) => t.durationMs !== undefined)
    .map((t) => `| ${t.label} | ${t.durationMs}ms |`);

  return [
    '| Step | Duration |',
    '|------|----------|',
    ...rows,
  ].join('\n');
}
