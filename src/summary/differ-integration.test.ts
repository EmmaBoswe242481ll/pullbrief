import {
  compareSummaries,
  shouldUpdatePRBody,
  buildDiffChangelogNote,
} from './differ-integration';

const OLD_BODY = `## Summary\nFixes a bug\n## Changes\n- file.ts`;
const NEW_BODY = `## Summary\nFixes a critical bug\n## Changes\n- file.ts\n- utils.ts`;

describe('compareSummaries', () => {
  it('detects changes between two bodies', () => {
    const report = compareSummaries(OLD_BODY, NEW_BODY);
    expect(report.hasChanges).toBe(true);
  });

  it('reports no changes for identical bodies', () => {
    const report = compareSummaries(OLD_BODY, OLD_BODY);
    expect(report.hasChanges).toBe(false);
  });

  it('records correct lengths', () => {
    const report = compareSummaries(OLD_BODY, NEW_BODY);
    expect(report.previousLength).toBe(OLD_BODY.length);
    expect(report.currentLength).toBe(NEW_BODY.length);
  });

  it('includes a markdown summary when there are changes', () => {
    const report = compareSummaries(OLD_BODY, NEW_BODY);
    expect(typeof report.markdownSummary).toBe('string');
  });

  it('stats reflect added and removed lines', () => {
    const report = compareSummaries('a\nb', 'a\nc\nd');
    expect(report.stats.totalAdded).toBeGreaterThan(0);
  });
});

describe('shouldUpdatePRBody', () => {
  it('returns true when there are meaningful changes', () => {
    const report = compareSummaries(OLD_BODY, NEW_BODY);
    expect(shouldUpdatePRBody(report)).toBe(true);
  });

  it('returns false when there are no changes', () => {
    const report = compareSummaries(OLD_BODY, OLD_BODY);
    expect(shouldUpdatePRBody(report)).toBe(false);
  });

  it('returns false for negligible length differences', () => {
    const report = compareSummaries('hello world', 'hello world!');
    // length diff is 1, under threshold of 3
    expect(shouldUpdatePRBody(report)).toBe(false);
  });
});

describe('buildDiffChangelogNote', () => {
  it('returns empty string when no changes', () => {
    const report = compareSummaries(OLD_BODY, OLD_BODY);
    expect(buildDiffChangelogNote(report)).toBe('');
  });

  it('includes percentage changed', () => {
    const report = compareSummaries(OLD_BODY, NEW_BODY);
    const note = buildDiffChangelogNote(report);
    expect(note).toMatch(/\d+% of content changed/);
  });

  it('includes added and removed counts', () => {
    const report = compareSummaries(OLD_BODY, NEW_BODY);
    const note = buildDiffChangelogNote(report);
    expect(note).toMatch(/\+\d+ lines added/);
    expect(note).toMatch(/-\d+ lines removed/);
  });

  it('includes diff details block when there are changes', () => {
    const report = compareSummaries(OLD_BODY, NEW_BODY);
    const note = buildDiffChangelogNote(report);
    expect(note).toContain('<details>');
  });
});
