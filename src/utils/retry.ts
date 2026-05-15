/**
 * Retry utility for handling transient failures in GitHub API calls
 * and other async operations.
 */

export interface RetryOptions {
  maxAttempts?: number;
  delayMs?: number;
  backoffFactor?: number;
  shouldRetry?: (error: unknown) => boolean;
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxAttempts: 3,
  delayMs: 500,
  backoffFactor: 2,
  shouldRetry: () => true,
};

export class RetryExhaustedError extends Error {
  constructor(
    public readonly attempts: number,
    public readonly lastError: unknown
  ) {
    super(`Operation failed after ${attempts} attempt(s)`);
    this.name = 'RetryExhaustedError';
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  let lastError: unknown;

  for (let attempt = 1; attempt <= opts.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;

      if (attempt === opts.maxAttempts || !opts.shouldRetry(err)) {
        break;
      }

      const waitMs = opts.delayMs * Math.pow(opts.backoffFactor, attempt - 1);
      await delay(waitMs);
    }
  }

  throw new RetryExhaustedError(opts.maxAttempts, lastError);
}

export function isRateLimitError(error: unknown): boolean {
  if (typeof error === 'object' && error !== null) {
    const status = (error as Record<string, unknown>).status;
    return status === 429 || status === 403;
  }
  return false;
}
