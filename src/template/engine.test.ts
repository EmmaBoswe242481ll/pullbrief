import { renderTemplate, TemplateContext } from './engine';

const baseContext: TemplateContext = {
  prTitle: 'Add login feature',
  prNumber: 42,
  author: 'octocat',
  date: '2024-06-01',
  commits: [
    { hash: 'abc1234', message: 'add login endpoint', type: 'feat' },
    { hash: 'def5678', message: 'fix typo in readme', type: 'fix' },
  ],
  changedFiles: ['src/auth/login.ts', 'README.md'],
};

describe('renderTemplate', () => {
  it('interpolates simple string variables', () => {
    const result = renderTemplate('PR #{{prNumber}} by {{author}}', baseContext);
    expect(result).toBe('PR #42 by octocat');
  });

  it('returns empty string for unknown variables', () => {
    const result = renderTemplate('Hello {{unknown}}', baseContext);
    expect(result).toBe('Hello ');
  });

  it('renders commit blocks correctly', () => {
    const template = '{{#commits}}- {{type}}: {{message}}\n{{/commits}}';
    const result = renderTemplate(template, baseContext);
    expect(result).toContain('- feat: add login endpoint');
    expect(result).toContain('- fix: fix typo in readme');
  });

  it('renders changedFiles blocks correctly', () => {
    const template = '{{#changedFiles}}* {{file}}\n{{/changedFiles}}';
    const result = renderTemplate(template, baseContext);
    expect(result).toContain('* src/auth/login.ts');
    expect(result).toContain('* README.md');
  });

  it('handles empty commits list gracefully', () => {
    const ctx = { ...baseContext, commits: [] };
    const template = '{{#commits}}- {{message}}\n{{/commits}}';
    const result = renderTemplate(template, ctx);
    expect(result).toBe('');
  });

  it('handles empty changedFiles list gracefully', () => {
    const ctx = { ...baseContext, changedFiles: [] };
    const template = '{{#changedFiles}}* {{file}}\n{{/changedFiles}}';
    const result = renderTemplate(template, ctx);
    expect(result).toBe('');
  });
});
