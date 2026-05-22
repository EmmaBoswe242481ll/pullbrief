import {
  createMetrics,
  mergeMetrics,
  formatMetricsMarkdown,
  buildMetricsSummary,
  ActionMetrics,
} from './metrics';

describe('createMetrics', () => {
  it('returns defaults when called with no args', () => {
    const m = createMetrics();
    expect(m.totalCommits).toBe(0);
    expect(m.totalFiles).toBe(0);
    expect(m.categoriesFound).toEqual([]);
    expect(m.templateUsed).toBe('default');
  });

  it('merges partial values over defaults', () => {
    const m = createMetrics({ totalCommits: 5, templateUsed: 'custom' });
    expect(m.totalCommits).toBe(5);
    expect(m.templateUsed).toBe('custom');
    expect(m.totalFiles).toBe(0);
  });
});

describe('mergeMetrics', () => {
  it('merges simple numeric fields', () => {
    const base = createMetrics({ totalCommits: 3 });
    const result = mergeMetrics(base, { totalCommits: 10, authors: 2 });
    expect(result.totalCommits).toBe(10);
    expect(result.authors).toBe(2);
  });

  it('deduplicates categoriesFound when merging', () => {
    const base = createMetrics({ categoriesFound: ['feat', 'fix'] });
    const result = mergeMetrics(base, { categoriesFound: ['fix', 'chore'] });
    expect(result.categoriesFound).toEqual(['feat', 'fix', 'chore']);
  });

  it('keeps base categories when patch has none', () => {
    const base = createMetrics({ categoriesFound: ['feat'] });
    const result = mergeMetrics(base, { totalFiles: 7 });
    expect(result.categoriesFound).toEqual(['feat']);
  });
});

describe('formatMetricsMarkdown', () => {
  const sample: ActionMetrics = createMetrics({
    totalCommits: 12,
    totalFiles: 8,
    breakingChanges: 1,
    authors: 3,
    categoriesFound: ['feat', 'fix'],
    generationTimeMs: 42,
    templateUsed: 'compact',
  });

  it('includes heading', () => {
    expect(formatMetricsMarkdown(sample)).toContain('📊 Generation Metrics');
  });

  it('includes commit count', () => {
    expect(formatMetricsMarkdown(sample)).toContain('12');
  });

  it('lists categories', () => {
    expect(formatMetricsMarkdown(sample)).toContain('feat, fix');
  });

  it('shows none when no categories', () => {
    const m = createMetrics();
    expect(formatMetricsMarkdown(m)).toContain('none');
  });
});

describe('buildMetricsSummary', () => {
  it('wraps metrics with a timestamp', () => {
    const m = createMetrics({ totalCommits: 1 });
    const summary = buildMetricsSummary(m);
    expect(summary.metrics).toBe(m);
    expect(typeof summary.formattedAt).toBe('string');
    expect(() => new Date(summary.formattedAt)).not.toThrow();
  });
});
