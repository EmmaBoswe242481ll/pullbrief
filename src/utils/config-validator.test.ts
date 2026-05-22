import { validateConfig, assertValidConfig } from './config-validator';
import { CONFIG_DEFAULTS, PullBriefConfig } from './config';

function makeConfig(overrides: Partial<PullBriefConfig> = {}): PullBriefConfig {
  return { ...CONFIG_DEFAULTS, ...overrides };
}

describe('validateConfig', () => {
  it('returns valid for default config', () => {
    const result = validateConfig(makeConfig());
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.warnings).toHaveLength(0);
  });

  it('reports error when maxCommits is zero', () => {
    const result = validateConfig(makeConfig({ maxCommits: 0 }));
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('max_commits must be a positive integer');
  });

  it('reports error when maxCommits is negative', () => {
    const result = validateConfig(makeConfig({ maxCommits: -5 }));
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('reports warning when maxCommits exceeds 500', () => {
    const result = validateConfig(makeConfig({ maxCommits: 501 }));
    expect(result.valid).toBe(true);
    expect(result.warnings.some((w) => w.includes('max_commits exceeds'))).toBe(true);
  });

  it('reports error when maxFilesListed is zero', () => {
    const result = validateConfig(makeConfig({ maxFilesListed: 0 }));
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('max_files_listed must be a positive integer');
  });

  it('reports warning when maxFilesListed exceeds 200', () => {
    const result = validateConfig(makeConfig({ maxFilesListed: 201 }));
    expect(result.valid).toBe(true);
    expect(result.warnings.some((w) => w.includes('max_files_listed exceeds'))).toBe(true);
  });

  it('warns when templatePath does not end with .md', () => {
    const result = validateConfig(makeConfig({ templatePath: '.github/template.txt' }));
    expect(result.warnings.some((w) => w.includes('template_path does not end with .md'))).toBe(true);
  });

  it('does not warn when templatePath is empty', () => {
    const result = validateConfig(makeConfig({ templatePath: '' }));
    expect(result.warnings.some((w) => w.includes('template_path'))).toBe(false);
  });

  it('warns when dryRun is true and updateExisting is true', () => {
    const result = validateConfig(makeConfig({ dryRun: true, updateExisting: true }));
    expect(result.warnings.some((w) => w.includes('dry_run'))).toBe(true);
  });

  it('does not warn about dryRun when updateExisting is false', () => {
    const result = validateConfig(makeConfig({ dryRun: true, updateExisting: false }));
    expect(result.warnings.some((w) => w.includes('dry_run'))).toBe(false);
  });
});

describe('assertValidConfig', () => {
  it('does not throw for valid config', () => {
    expect(() => assertValidConfig(makeConfig())).not.toThrow();
  });

  it('throws with descriptive message for invalid config', () => {
    expect(() => assertValidConfig(makeConfig({ maxCommits: -1 }))).toThrow(
      /Invalid pullbrief configuration/
    );
  });
});
