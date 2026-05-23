import { buildChangelogSections, formatChangelogMarkdown } from './changelog';

describe('buildChangelogSections', () => {
  const messages = [
    'feat: add dark mode support',
    'fix: resolve null pointer in parser',
    'docs: update README with examples',
    'chore: bump dependencies',
    'feat: add dark mode support', // duplicate
    'Merge branch main into feature/x',
  ];

  it('groups commits by type', () => {
    const sections = buildChangelogSections(messages);
    const types = sections.map((s) => s.type);
    expect(types).toContain('feat');
    expect(types).toContain('fix');
    expect(types).toContain('docs');
  });

  it('deduplicates messages', () => {
    const sections = buildChangelogSections(messages);
    const feat = sections.find((s) => s.type === 'feat');
    expect(feat?.entries.length).toBe(1);
  });

  it('excludes merge commits by default', () => {
    const sections = buildChangelogSections(messages);
    const allEntries = sections.flatMap((s) => s.entries);
    expect(allEntries.some((e) => e.startsWith('Merge'))).toBe(false);
  });

  it('includes merge commits when option is set', () => {
    const sections = buildChangelogSections(messages, { includeMergeCommits: true });
    const allEntries = sections.flatMap((s) => s.entries);
    expect(allEntries.some((e) => e.startsWith('Merge'))).toBe(true);
  });

  it('respects maxEntriesPerSection', () => {
    const many = Array.from({ length: 30 }, (_, i) => `feat: feature ${i}`);
    const sections = buildChangelogSections(many, { maxEntriesPerSection: 5 });
    expect(sections[0].entries.length).toBeLessThanOrEqual(5);
  });

  it('returns empty array for empty input', () => {
    expect(buildChangelogSections([])).toEqual([]);
  });
});

describe('formatChangelogMarkdown', () => {
  it('returns fallback for empty sections', () => {
    expect(formatChangelogMarkdown([])).toContain('No categorized');
  });

  it('renders section headings', () => {
    const sections = buildChangelogSections(['feat: new thing', 'fix: broken thing']);
    const md = formatChangelogMarkdown(sections);
    expect(md).toContain('Features');
    expect(md).toContain('Bug Fixes');
  });

  it('includes pr title when provided', () => {
    const sections = buildChangelogSections(['feat: something']);
    const md = formatChangelogMarkdown(sections, 'My PR Title');
    expect(md).toContain('My PR Title');
  });

  it('includes change count summary', () => {
    const sections = buildChangelogSections(['feat: a', 'fix: b']);
    const md = formatChangelogMarkdown(sections);
    expect(md).toMatch(/\d+ change/);
  });
});
