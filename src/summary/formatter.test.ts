import { formatSummary, FormatterOptions } from './formatter';
import { CommitGroup } from '../commits/parser';
import { FileSummary } from '../files/summarizer';

const mockCommitGroups: CommitGroup[] = [
  {
    type: 'feat',
    commits: [
      { type: 'feat', subject: 'add dark mode support', scope: 'ui', breaking: false, author: 'alice', body: '', footer: '' },
      { type: 'feat', subject: 'introduce plugin system', scope: undefined, breaking: true, author: 'bob', body: '', footer: '' },
    ],
  },
  {
    type: 'fix',
    commits: [
      { type: 'fix', subject: 'resolve memory leak in parser', scope: 'core', breaking: false, author: 'alice', body: '', footer: '' },
    ],
  },
];

const mockFileSummary: FileSummary = {
  totalCount: 5,
  byCategory: { source: 3, tests: 2 },
  highlights: ['src/index.ts', 'src/parser.ts'],
  markdown: '',
};

describe('formatSummary', () => {
  it('returns formatted sections for each commit group', () => {
    const result = formatSummary(mockCommitGroups, mockFileSummary);
    const headings = result.sections.map((s) => s.heading);
    expect(headings).toContain('✨ Features');
    expect(headings).toContain('🐛 Bug Fixes');
  });

  it('prepends breaking changes section when present', () => {
    const result = formatSummary(mockCommitGroups, mockFileSummary, { includeBreakingChanges: true });
    expect(result.sections[0].heading).toBe('🚨 Breaking Changes');
    expect(result.sections[0].items[0]).toContain('introduce plugin system');
  });

  it('does not include breaking changes section when disabled', () => {
    const result = formatSummary(mockCommitGroups, mockFileSummary, { includeBreakingChanges: false });
    const headings = result.sections.map((s) => s.heading);
    expect(headings).not.toContain('🚨 Breaking Changes');
  });

  it('includes file highlights section', () => {
    const result = formatSummary(mockCommitGroups, mockFileSummary);
    const fileSection = result.sections.find((s) => s.heading === '📁 Changed Files');
    expect(fileSection).toBeDefined();
    expect(fileSection?.items).toHaveLength(2);
  });

  it('populates metadata correctly', () => {
    const result = formatSummary(mockCommitGroups, mockFileSummary);
    expect(result.metadata.totalCommits).toBe(3);
    expect(result.metadata.totalFilesChanged).toBe(5);
    expect(result.metadata.hasBreakingChanges).toBe(true);
    expect(result.metadata.authors).toContain('alice');
    expect(result.metadata.authors).toContain('bob');
  });

  it('respects maxCommitsPerGroup option', () => {
    const result = formatSummary(mockCommitGroups, mockFileSummary, { maxCommitsPerGroup: 1 });
    const featSection = result.sections.find((s) => s.heading === '✨ Features');
    expect(featSection?.items).toHaveLength(1);
  });

  it('sets title to Feature Release when feat commits exist', () => {
    const result = formatSummary(mockCommitGroups, mockFileSummary);
    expect(result.title).toBe('Feature Release');
  });
});
