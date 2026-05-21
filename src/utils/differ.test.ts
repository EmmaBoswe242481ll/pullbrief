import { diffLines, computeDiffStats, formatDiffMarkdown } from './differ';

describe('diffLines', () => {
  it('detects added lines', () => {
    const result = diffLines('hello', 'hello\nworld');
    expect(result.added).toContain('world');
    expect(result.addedCount).toBe(1);
  });

  it('detects removed lines', () => {
    const result = diffLines('hello\nworld', 'hello');
    expect(result.removed).toContain('world');
    expect(result.removedCount).toBe(1);
  });

  it('detects unchanged lines', () => {
    const result = diffLines('hello\nworld', 'hello\nearth');
    expect(result.unchanged).toContain('hello');
    expect(result.unchanged).not.toContain('world');
  });

  it('handles identical strings', () => {
    const result = diffLines('same\ncontent', 'same\ncontent');
    expect(result.addedCount).toBe(0);
    expect(result.removedCount).toBe(0);
    expect(result.unchanged).toHaveLength(2);
  });

  it('handles empty before string', () => {
    const result = diffLines('', 'new line');
    expect(result.added).toContain('new line');
  });

  it('handles empty after string', () => {
    const result = diffLines('old line', '');
    expect(result.removed).toContain('old line');
  });
});

describe('computeDiffStats', () => {
  it('returns zero ratio for empty diff', () => {
    const diff = diffLines('', '');
    const stats = computeDiffStats(diff);
    expect(stats.changeRatio).toBe(0);
  });

  it('computes correct totals', () => {
    const diff = diffLines('a\nb\nc', 'a\nd\ne');
    const stats = computeDiffStats(diff);
    expect(stats.totalAdded).toBe(diff.addedCount);
    expect(stats.totalRemoved).toBe(diff.removedCount);
    expect(stats.totalChanged).toBe(diff.addedCount + diff.removedCount);
  });

  it('change ratio is between 0 and 1', () => {
    const diff = diffLines('a\nb', 'a\nc');
    const stats = computeDiffStats(diff);
    expect(stats.changeRatio).toBeGreaterThanOrEqual(0);
    expect(stats.changeRatio).toBeLessThanOrEqual(1);
  });
});

describe('formatDiffMarkdown', () => {
  it('includes added count in output', () => {
    const diff = diffLines('a', 'a\nb\nc');
    const md = formatDiffMarkdown(diff);
    expect(md).toContain('+2 added');
  });

  it('includes removed count in output', () => {
    const diff = diffLines('a\nb', 'a');
    const md = formatDiffMarkdown(diff);
    expect(md).toContain('-1 removed');
  });

  it('returns empty string for no changes', () => {
    const diff = diffLines('same', 'same');
    const md = formatDiffMarkdown(diff);
    expect(md).toBe('');
  });

  it('truncates long added lists', () => {
    const before = '';
    const after = Array.from({ length: 10 }, (_, i) => `line${i}`).join('\n');
    const diff = diffLines(before, after);
    const md = formatDiffMarkdown(diff);
    expect(md).toContain('more');
  });
});
