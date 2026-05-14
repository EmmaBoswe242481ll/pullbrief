import {
  PullBriefError,
  ErrorCode,
  isKnownError,
  wrapError,
  assertDefined,
} from './errors';

describe('PullBriefError', () => {
  it('should create an error with the correct properties', () => {
    const err = new PullBriefError('something went wrong', ErrorCode.GITHUB_API_ERROR);
    expect(err.message).toBe('something went wrong');
    expect(err.code).toBe(ErrorCode.GITHUB_API_ERROR);
    expect(err.name).toBe('PullBriefError');
    expect(err.cause).toBeUndefined();
  });

  it('should store a cause error', () => {
    const cause = new Error('original error');
    const err = new PullBriefError('wrapped', ErrorCode.TEMPLATE_RENDER_ERROR, cause);
    expect(err.cause).toBe(cause);
  });

  it('toJSON should return a plain object', () => {
    const cause = new Error('root cause');
    const err = new PullBriefError('test', ErrorCode.UNKNOWN, cause);
    const json = err.toJSON();
    expect(json.name).toBe('PullBriefError');
    expect(json.message).toBe('test');
    expect(json.code).toBe(ErrorCode.UNKNOWN);
    expect(json.cause).toBe('root cause');
  });

  it('instanceof check should work correctly', () => {
    const err = new PullBriefError('test', ErrorCode.COMMIT_PARSE_ERROR);
    expect(err instanceof PullBriefError).toBe(true);
    expect(err instanceof Error).toBe(true);
  });
});

describe('isKnownError', () => {
  it('returns true for PullBriefError', () => {
    expect(isKnownError(new PullBriefError('x', ErrorCode.UNKNOWN))).toBe(true);
  });

  it('returns false for plain Error', () => {
    expect(isKnownError(new Error('x'))).toBe(false);
  });

  it('returns false for non-error values', () => {
    expect(isKnownError('string error')).toBe(false);
    expect(isKnownError(null)).toBe(false);
  });
});

describe('wrapError', () => {
  it('wraps a plain Error into PullBriefError', () => {
    const original = new Error('original');
    const wrapped = wrapError(original, ErrorCode.FILE_DETECTION_ERROR);
    expect(wrapped).toBeInstanceOf(PullBriefError);
    expect(wrapped.cause).toBe(original);
    expect(wrapped.code).toBe(ErrorCode.FILE_DETECTION_ERROR);
  });

  it('returns the same PullBriefError if already wrapped', () => {
    const err = new PullBriefError('already wrapped', ErrorCode.GITHUB_API_ERROR);
    expect(wrapError(err, ErrorCode.UNKNOWN)).toBe(err);
  });

  it('wraps a string error', () => {
    const wrapped = wrapError('oops', ErrorCode.UNKNOWN, 'custom message');
    expect(wrapped.message).toBe('custom message');
  });
});

describe('assertDefined', () => {
  it('does not throw for defined values', () => {
    expect(() => assertDefined('value', 'field')).not.toThrow();
    expect(() => assertDefined(0, 'field')).not.toThrow();
  });

  it('throws PullBriefError for null', () => {
    expect(() => assertDefined(null, 'myField')).toThrow(PullBriefError);
  });

  it('throws PullBriefError for undefined', () => {
    expect(() => assertDefined(undefined, 'myField')).toThrow(PullBriefError);
  });

  it('includes the field name in the error message', () => {
    try {
      assertDefined(null, 'repoName');
    } catch (e) {
      expect((e as PullBriefError).message).toContain('repoName');
    }
  });
});
