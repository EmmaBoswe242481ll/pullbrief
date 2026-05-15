import { withRetry, RetryExhaustedError, isRateLimitError } from './retry';

describe('withRetry', () => {
  it('returns result on first successful attempt', async () => {
    const fn = jest.fn().mockResolvedValue('ok');
    const result = await withRetry(fn);
    expect(result).toBe('ok');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('retries on failure and succeeds eventually', async () => {
    const fn = jest
      .fn()
      .mockRejectedValueOnce(new Error('fail'))
      .mockRejectedValueOnce(new Error('fail again'))
      .mockResolvedValue('success');

    const result = await withRetry(fn, { delayMs: 0 });
    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('throws RetryExhaustedError after max attempts', async () => {
    const fn = jest.fn().mockRejectedValue(new Error('always fails'));

    await expect(
      withRetry(fn, { maxAttempts: 3, delayMs: 0 })
    ).rejects.toBeInstanceOf(RetryExhaustedError);

    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('stops retrying if shouldRetry returns false', async () => {
    const fn = jest.fn().mockRejectedValue(new Error('non-retryable'));

    await expect(
      withRetry(fn, { maxAttempts: 5, delayMs: 0, shouldRetry: () => false })
    ).rejects.toBeInstanceOf(RetryExhaustedError);

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('RetryExhaustedError exposes attempt count and last error', async () => {
    const cause = new Error('root cause');
    const fn = jest.fn().mockRejectedValue(cause);

    try {
      await withRetry(fn, { maxAttempts: 2, delayMs: 0 });
    } catch (err) {
      expect(err).toBeInstanceOf(RetryExhaustedError);
      const retryErr = err as RetryExhaustedError;
      expect(retryErr.attempts).toBe(2);
      expect(retryErr.lastError).toBe(cause);
    }
  });
});

describe('isRateLimitError', () => {
  it('returns true for 429 status', () => {
    expect(isRateLimitError({ status: 429 })).toBe(true);
  });

  it('returns true for 403 status', () => {
    expect(isRateLimitError({ status: 403 })).toBe(true);
  });

  it('returns false for other statuses', () => {
    expect(isRateLimitError({ status: 500 })).toBe(false);
  });

  it('returns false for non-objects', () => {
    expect(isRateLimitError('error string')).toBe(false);
    expect(isRateLimitError(null)).toBe(false);
  });
});
