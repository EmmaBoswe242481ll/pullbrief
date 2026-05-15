import { validateInputs, assertValidInputs, PullRequestInputs } from './validator';

const validInputs: PullRequestInputs = {
  token: 'ghp_testtoken123',
  owner: 'octocat',
  repo: 'hello-world',
  prNumber: 42,
};

describe('validateInputs', () => {
  it('returns valid for complete correct inputs', () => {
    const result = validateInputs(validInputs);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('returns error when token is missing', () => {
    const result = validateInputs({ ...validInputs, token: '' });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('GitHub token is required and must not be empty.');
  });

  it('returns error when owner is missing', () => {
    const result = validateInputs({ ...validInputs, owner: '' });
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('owner'))).toBe(true);
  });

  it('returns error for owner with invalid characters', () => {
    const result = validateInputs({ ...validInputs, owner: 'bad owner!' });
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('invalid characters'))).toBe(true);
  });

  it('returns error when repo exceeds max length', () => {
    const result = validateInputs({ ...validInputs, repo: 'a'.repeat(101) });
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('100 characters'))).toBe(true);
  });

  it('returns error for non-integer PR number', () => {
    const result = validateInputs({ ...validInputs, prNumber: 3.5 });
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('positive integer'))).toBe(true);
  });

  it('returns error for PR number less than 1', () => {
    const result = validateInputs({ ...validInputs, prNumber: 0 });
    expect(result.valid).toBe(false);
  });

  it('returns error for invalid log level', () => {
    const result = validateInputs({ ...validInputs, logLevel: 'verbose' });
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('log level'))).toBe(true);
  });

  it('accepts valid log levels', () => {
    for (const level of ['debug', 'info', 'warn', 'error']) {
      const result = validateInputs({ ...validInputs, logLevel: level });
      expect(result.valid).toBe(true);
    }
  });

  it('collects multiple errors at once', () => {
    const result = validateInputs({ token: '', owner: '', repo: '', prNumber: -1 });
    expect(result.errors.length).toBeGreaterThan(1);
  });
});

describe('assertValidInputs', () => {
  it('does not throw for valid inputs', () => {
    expect(() => assertValidInputs(validInputs)).not.toThrow();
  });

  it('throws with formatted message for invalid inputs', () => {
    expect(() => assertValidInputs({ token: '', owner: 'octocat', repo: 'repo', prNumber: 1 }))
      .toThrow('Invalid inputs');
  });
});
