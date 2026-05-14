/**
 * Custom error types for pullbrief
 */

export enum ErrorCode {
  GITHUB_API_ERROR = 'GITHUB_API_ERROR',
  INVALID_CONTEXT = 'INVALID_CONTEXT',
  TEMPLATE_NOT_FOUND = 'TEMPLATE_NOT_FOUND',
  TEMPLATE_RENDER_ERROR = 'TEMPLATE_RENDER_ERROR',
  COMMIT_PARSE_ERROR = 'COMMIT_PARSE_ERROR',
  FILE_DETECTION_ERROR = 'FILE_DETECTION_ERROR',
  SUMMARY_GENERATION_ERROR = 'SUMMARY_GENERATION_ERROR',
  UNKNOWN = 'UNKNOWN',
}

export class PullBriefError extends Error {
  public readonly code: ErrorCode;
  public readonly cause?: Error;

  constructor(message: string, code: ErrorCode, cause?: Error) {
    super(message);
    this.name = 'PullBriefError';
    this.code = code;
    this.cause = cause;
    Object.setPrototypeOf(this, PullBriefError.prototype);
  }

  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      cause: this.cause?.message,
    };
  }
}

export function isKnownError(err: unknown): err is PullBriefError {
  return err instanceof PullBriefError;
}

export function wrapError(err: unknown, code: ErrorCode, message?: string): PullBriefError {
  if (err instanceof PullBriefError) return err;
  const cause = err instanceof Error ? err : new Error(String(err));
  return new PullBriefError(message ?? cause.message, code, cause);
}

export function assertDefined<T>(
  value: T | null | undefined,
  field: string,
  code: ErrorCode = ErrorCode.INVALID_CONTEXT
): asserts value is T {
  if (value === null || value === undefined) {
    throw new PullBriefError(`Expected '${field}' to be defined, but got ${value}.`, code);
  }
}
