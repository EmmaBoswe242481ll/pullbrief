import { mergeConfig, loadConfig, CONFIG_DEFAULTS, PullBriefConfig } from './config';

jest.mock('@actions/core', () => ({
  getInput: jest.fn(),
}));

import { getInput } from '@actions/core';
const mockGetInput = getInput as jest.MockedFunction<typeof getInput>;

function mockInputs(inputs: Record<string, string>) {
  mockGetInput.mockImplementation((name: string) => inputs[name] ?? '');
}

describe('loadConfig', () => {
  beforeEach(() => {
    mockGetInput.mockReset();
    mockInputs({});
  });

  it('returns defaults when no inputs are provided', () => {
    const config = loadConfig();
    expect(config.maxCommits).toBe(100);
    expect(config.maxFilesListed).toBe(20);
    expect(config.includeAuthors).toBe(true);
    expect(config.includeBreakingChanges).toBe(true);
    expect(config.templatePath).toBe('');
    expect(config.logLevel).toBe('info');
    expect(config.dryRun).toBe(false);
    expect(config.updateExisting).toBe(true);
  });

  it('parses numeric inputs correctly', () => {
    mockInputs({ max_commits: '50', max_files_listed: '10' });
    const config = loadConfig();
    expect(config.maxCommits).toBe(50);
    expect(config.maxFilesListed).toBe(10);
  });

  it('falls back to default for invalid numbers', () => {
    mockInputs({ max_commits: 'not-a-number' });
    const config = loadConfig();
    expect(config.maxCommits).toBe(100);
  });

  it('parses boolean inputs correctly', () => {
    mockInputs({ include_authors: 'false', dry_run: 'true' });
    const config = loadConfig();
    expect(config.includeAuthors).toBe(false);
    expect(config.dryRun).toBe(true);
  });

  it('parses log level correctly', () => {
    mockInputs({ log_level: 'debug' });
    const config = loadConfig();
    expect(config.logLevel).toBe('debug');
  });

  it('falls back to info for invalid log level', () => {
    mockInputs({ log_level: 'verbose' });
    const config = loadConfig();
    expect(config.logLevel).toBe('info');
  });

  it('reads template_path when provided', () => {
    mockInputs({ template_path: '.github/pr-template.md' });
    const config = loadConfig();
    expect(config.templatePath).toBe('.github/pr-template.md');
  });
});

describe('mergeConfig', () => {
  it('merges overrides onto base config', () => {
    const base = { ...CONFIG_DEFAULTS };
    const merged = mergeConfig(base, { dryRun: true, maxCommits: 25 });
    expect(merged.dryRun).toBe(true);
    expect(merged.maxCommits).toBe(25);
    expect(merged.logLevel).toBe('info');
  });

  it('does not mutate the base config', () => {
    const base: PullBriefConfig = { ...CONFIG_DEFAULTS };
    mergeConfig(base, { dryRun: true });
    expect(base.dryRun).toBe(false);
  });
});
