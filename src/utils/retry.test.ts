import { delay, isRateLimitError, withRetry } from './retry';

describe('delay', () => {
  it('resolves after approximately the given milliseconds', async () => {
    const start = Date.now();
    await delay(50);
    expect(Date.now() - start).toBeGreaterThanOrEqual(40);
  });
});

describe('isRateLimitError', () => {
  it('returns true for rate limit message', () => {
    expect(isRateLimitError(new Error('rate limit exceeded'))).toBe(true);
  });

  it('returns true for 429 in message', () => {
    expect(isRateLimitError(new Error('HTTP 429 Too Many Requests'))).toBe(true);
  });

  it('returns true for too many requests message', () => {
    expect(isRateLimitError(new Error('too many requests'))).toBe(true);
  });

  it('returns false for unrelated errors', () => {
    expect(isRateLimitError(new Error('Not found'))).toBe(false);
  });

  it('returns false for non-Error values', () => {
    expect(isRateLimitError('string error')).toBe(false);
    expect(isRateLimitError(null)).toBe(false);
  });
});

describe('withRetry', () => {
  it('returns result on first successful attempt', async () => {
    const fn = jest.fn().mockResolvedValue('ok');
    const result = await withRetry(fn);
    expect(result).toBe('ok');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('retries on rate limit errors and eventually succeeds', async () => {
    const fn = jest
      .fn()
      .mockRejectedValueOnce(new Error('rate limit exceeded'))
      .mockResolvedValue('success');

    const result = await withRetry(fn, { baseDelayMs: 10 });
    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('throws immediately for non-retryable errors', async () => {
    const fn = jest.fn().mockRejectedValue(new Error('Not found'));
    await expect(withRetry(fn, { baseDelayMs: 10 })).rejects.toThrow('Not found');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('throws after exhausting max attempts', async () => {
    const fn = jest.fn().mockRejectedValue(new Error('rate limit exceeded'));
    await expect(
      withRetry(fn, { maxAttempts: 3, baseDelayMs: 10 })
    ).rejects.toThrow('rate limit exceeded');
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('respects custom shouldRetry predicate', async () => {
    const fn = jest
      .fn()
      .mockRejectedValueOnce(new Error('custom retryable'))
      .mockResolvedValue('done');

    const result = await withRetry(fn, {
      baseDelayMs: 10,
      shouldRetry: (e) => e instanceof Error && e.message.includes('custom'),
    });
    expect(result).toBe('done');
    expect(fn).toHaveBeenCalledTimes(2);
  });
});
