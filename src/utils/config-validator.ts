import { PullBriefConfig } from './config';

export interface ConfigValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

const MAX_COMMITS_LIMIT = 500;
const MAX_FILES_LIMIT = 200;

export function validateConfig(config: PullBriefConfig): ConfigValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (config.maxCommits <= 0) {
    errors.push('max_commits must be a positive integer');
  } else if (config.maxCommits > MAX_COMMITS_LIMIT) {
    warnings.push(`max_commits exceeds ${MAX_COMMITS_LIMIT}; this may impact performance`);
  }

  if (config.maxFilesListed <= 0) {
    errors.push('max_files_listed must be a positive integer');
  } else if (config.maxFilesListed > MAX_FILES_LIMIT) {
    warnings.push(`max_files_listed exceeds ${MAX_FILES_LIMIT}; summary may be very long`);
  }

  if (config.templatePath !== '' && !config.templatePath.endsWith('.md')) {
    warnings.push('template_path does not end with .md; ensure the file is a Markdown template');
  }

  if (config.dryRun && config.updateExisting) {
    warnings.push('dry_run is true; update_existing will have no effect');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

export function assertValidConfig(config: PullBriefConfig): void {
  const result = validateConfig(config);
  if (!result.valid) {
    throw new Error(
      `Invalid pullbrief configuration:\n${result.errors.map((e) => `  - ${e}`).join('\n')}`
    );
  }
}
