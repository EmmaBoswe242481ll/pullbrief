import {
  buildLabeledCommitSections,
  buildLabeledFileSections,
  renderLabeledSection,
  renderAllLabeledSections,
  LabeledSection,
} from './labeled-sections';

describe('buildLabeledCommitSections', () => {
  it('maps commit types to labeled sections', () => {
    const grouped = { feat: ['add login', 'add signup'], fix: ['fix crash'] };
    const sections = buildLabeledCommitSections(grouped);
    expect(sections).toHaveLength(2);
    expect(sections[0].heading).toContain('Features');
    expect(sections[0].emoji).toBe('✨');
    expect(sections[0].items).toEqual(['add login', 'add signup']);
  });

  it('filters out empty arrays', () => {
    const grouped = { feat: ['something'], chore: [] };
    const sections = buildLabeledCommitSections(grouped);
    expect(sections).toHaveLength(1);
  });

  it('handles unknown commit types gracefully', () => {
    const grouped = { custom: ['do something'] };
    const sections = buildLabeledCommitSections(grouped);
    expect(sections[0].heading).toContain('Custom');
    expect(sections[0].emoji).toBe('🔹');
  });
});

describe('buildLabeledFileSections', () => {
  it('maps file categories to labeled sections', () => {
    const grouped = { source: ['src/index.ts'], test: ['src/index.test.ts'] };
    const sections = buildLabeledFileSections(grouped);
    expect(sections).toHaveLength(2);
    expect(sections[0].heading).toContain('Source Files');
  });

  it('filters empty categories', () => {
    const grouped = { source: [], config: ['.eslintrc'] };
    const sections = buildLabeledFileSections(grouped);
    expect(sections).toHaveLength(1);
    expect(sections[0].heading).toContain('Configuration');
  });
});

describe('renderLabeledSection', () => {
  const section: LabeledSection = {
    heading: '✨ Features',
    items: ['add thing', 'improve thing'],
    emoji: '✨',
  };

  it('renders heading and bullet list', () => {
    const output = renderLabeledSection(section);
    expect(output).toContain('✨ Features');
    expect(output).toContain('add thing');
    expect(output).toContain('improve thing');
  });

  it('uses specified heading level', () => {
    const output = renderLabeledSection(section, 2);
    expect(output).toMatch(/^## /);
  });
});

describe('renderAllLabeledSections', () => {
  it('returns empty string for no sections', () => {
    expect(renderAllLabeledSections([])).toBe('');
  });

  it('joins multiple sections with blank line', () => {
    const sections: LabeledSection[] = [
      { heading: '✨ Features', items: ['feat one'], emoji: '✨' },
      { heading: '🐛 Bug Fixes', items: ['fix one'], emoji: '🐛' },
    ];
    const output = renderAllLabeledSections(sections);
    expect(output).toContain('Features');
    expect(output).toContain('Bug Fixes');
    expect(output.split('\n\n').length).toBeGreaterThanOrEqual(2);
  });
});
