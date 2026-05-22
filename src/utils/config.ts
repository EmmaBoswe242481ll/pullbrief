import { getInput } from '@actions/core';

export interface PullBriefConfig {
  maxCommits: number;
  maxFilesListed: number;
  includeAuthors: boolean;
  includeBreakingChanges: boolean;
  templatePath: string;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  dryRun: boolean;
  updateExisting: boolean;
}

const DEFAULTS: PullBriefConfig = {
  maxCommits: 100,
  maxFilesListed: 20,
  includeAuthors: true,
  includeBreakingChanges: true,
  templatePath: '',
  logLevel: 'info',
  dryRun: false,
  updateExisting: true,
};

function parseBoolean(value: string, fallback: boolean): boolean {
  if (value === '') return fallback;
  return value.toLowerCase() === 'true';
}

function parseNumber(value: string, fallback: number): number {
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? fallback : parsed;
}

function parseLogLevel(value: string): PullBriefConfig['logLevel'] {
  const valid = ['debug', 'info', 'warn', 'error'] as const;
  return valid.includes(value as PullBriefConfig['logLevel'])
    ? (value as PullBriefConfig['logLevel'])
    : 'info';
}

export function loadConfig(): PullBriefConfig {
  return {
    maxCommits: parseNumber(getInput('max_commits'), DEFAULTS.maxCommits),
    maxFilesListed: parseNumber(getInput('max_files_listed'), DEFAULTS.maxFilesListed),
    includeAuthors: parseBoolean(getInput('include_authors'), DEFAULTS.includeAuthors),
    includeBreakingChanges: parseBoolean(
      getInput('include_breaking_changes'),
      DEFAULTS.includeBreakingChanges
    ),
    templatePath: getInput('template_path') || DEFAULTS.templatePath,
    logLevel: parseLogLevel(getInput('log_level')),
    dryRun: parseBoolean(getInput('dry_run'), DEFAULTS.dryRun),
    updateExisting: parseBoolean(getInput('update_existing'), DEFAULTS.updateExisting),
  };
}

export function mergeConfig(
  base: PullBriefConfig,
  overrides: Partial<PullBriefConfig>
): PullBriefConfig {
  return { ...base, ...overrides };
}

export { DEFAULTS as CONFIG_DEFAULTS };
