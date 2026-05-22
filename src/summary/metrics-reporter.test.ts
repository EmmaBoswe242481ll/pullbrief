import { MetricsReporter, createMetricsReporter } from './metrics-reporter';

describe('MetricsReporter', () => {
  it('initialises with zero metrics', () => {
    const reporter = new MetricsReporter();
    const m = reporter.getMetrics();
    expect(m.totalCommits).toBe(0);
    expect(m.categoriesFound).toEqual([]);
  });

  it('records patches cumulatively', () => {
    const reporter = new MetricsReporter();
    reporter.record({ totalCommits: 5 });
    reporter.record({ totalFiles: 3, totalCommits: 10 });
    expect(reporter.getMetrics().totalCommits).toBe(10);
    expect(reporter.getMetrics().totalFiles).toBe(3);
  });

  it('deduplicates categories across records', () => {
    const reporter = new MetricsReporter();
    reporter.record({ categoriesFound: ['feat', 'fix'] });
    reporter.record({ categoriesFound: ['fix', 'docs'] });
    expect(reporter.getMetrics().categoriesFound).toEqual(['feat', 'fix', 'docs']);
  });

  it('report returns markdown string', () => {
    const reporter = new MetricsReporter({ logToConsole: false });
    reporter.record({ totalCommits: 7 });
    const md = reporter.report();
    expect(md).toContain('📊 Generation Metrics');
    expect(md).toContain('7');
  });

  it('appendToBody does not modify body when includeInBody is false', () => {
    const reporter = new MetricsReporter({ includeInBody: false, logToConsole: false });
    reporter.record({ totalCommits: 2 });
    const result = reporter.appendToBody('## PR Summary');
    expect(result).toBe('## PR Summary');
  });

  it('appendToBody appends metrics when includeInBody is true', () => {
    const reporter = new MetricsReporter({ includeInBody: true, logToConsole: false });
    reporter.record({ totalCommits: 4 });
    const result = reporter.appendToBody('## PR Summary');
    expect(result).toContain('## PR Summary');
    expect(result).toContain('📊 Generation Metrics');
    expect(result).toContain('---');
  });

  it('reset clears all metrics', () => {
    const reporter = new MetricsReporter();
    reporter.record({ totalCommits: 99, authors: 5 });
    reporter.reset();
    expect(reporter.getMetrics().totalCommits).toBe(0);
    expect(reporter.getMetrics().authors).toBe(0);
  });
});

describe('createMetricsReporter', () => {
  it('returns a MetricsReporter instance', () => {
    const reporter = createMetricsReporter({ logToConsole: false });
    expect(reporter).toBeInstanceOf(MetricsReporter);
  });
});
