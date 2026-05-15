/**
 * Input validation utilities for pullbrief.
 */

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export interface PullRequestInputs {
  token: string;
  owner: string;
  repo: string;
  prNumber: number;
  templatePath?: string;
  logLevel?: string;
}

const VALID_LOG_LEVELS = ['debug', 'info', 'warn', 'error'];
const PR_NUMBER_MIN = 1;
const MAX_REPO_NAME_LENGTH = 100;
const REPO_NAME_PATTERN = /^[a-zA-Z0-9_.-]+$/;

export function validateInputs(inputs: Partial<PullRequestInputs>): ValidationResult {
  const errors: string[] = [];

  if (!inputs.token || inputs.token.trim() === '') {
    errors.push('GitHub token is required and must not be empty.');
  }

  if (!inputs.owner || inputs.owner.trim() === '') {
    errors.push('Repository owner is required.');
  } else if (!REPO_NAME_PATTERN.test(inputs.owner)) {
    errors.push(`Owner "${inputs.owner}" contains invalid characters.`);
  }

  if (!inputs.repo || inputs.repo.trim() === '') {
    errors.push('Repository name is required.');
  } else if (inputs.repo.length > MAX_REPO_NAME_LENGTH) {
    errors.push(`Repository name must not exceed ${MAX_REPO_NAME_LENGTH} characters.`);
  } else if (!REPO_NAME_PATTERN.test(inputs.repo)) {
    errors.push(`Repository name "${inputs.repo}" contains invalid characters.`);
  }

  if (inputs.prNumber === undefined || inputs.prNumber === null) {
    errors.push('Pull request number is required.');
  } else if (!Number.isInteger(inputs.prNumber) || inputs.prNumber < PR_NUMBER_MIN) {
    errors.push(`Pull request number must be a positive integer (got ${inputs.prNumber}).`);
  }

  if (inputs.logLevel !== undefined && !VALID_LOG_LEVELS.includes(inputs.logLevel)) {
    errors.push(`Invalid log level "${inputs.logLevel}". Must be one of: ${VALID_LOG_LEVELS.join(', ')}.`);
  }

  return { valid: errors.length === 0, errors };
}

export function assertValidInputs(inputs: Partial<PullRequestInputs>): asserts inputs is PullRequestInputs {
  const result = validateInputs(inputs);
  if (!result.valid) {
    throw new Error(`Invalid inputs:\n${result.errors.map(e => `  - ${e}`).join('\n')}`);
  }
}
