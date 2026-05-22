import { RateLimiter, createRateLimiter, createGitHubRateLimiter } from './rate-limiter';

describe('RateLimiter', () => {
  it('allows requests within limit', () => {
    const limiter = new RateLimiter({ maxRequests: 3, windowMs: 10_000 });
    expect(limiter.consume()).toBe(true);
    expect(limiter.consume()).toBe(true);
    expect(limiter.consume()).toBe(true);
  });

  it('blocks requests over limit', () => {
    const limiter = new RateLimiter({ maxRequests: 2, windowMs: 10_000 });
    limiter.consume();
    limiter.consume();
    expect(limiter.consume()).toBe(false);
  });

  it('resets after window expires', () => {
    const limiter = new RateLimiter({ maxRequests: 1, windowMs: 1 });
    limiter.consume();
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        expect(limiter.consume()).toBe(true);
        resolve();
      }, 10);
    });
  });

  it('getRemainingRequests returns correct count', () => {
    const limiter = new RateLimiter({ maxRequests: 5, windowMs: 10_000 });
    limiter.consume();
    limiter.consume();
    expect(limiter.getRemainingRequests()).toBe(3);
  });

  it('getResetTimeMs returns positive value within window', () => {
    const limiter = new RateLimiter({ maxRequests: 5, windowMs: 10_000 });
    limiter.consume();
    expect(limiter.getResetTimeMs()).toBeGreaterThan(0);
    expect(limiter.getResetTimeMs()).toBeLessThanOrEqual(10_000);
  });

  it('reset clears state', () => {
    const limiter = new RateLimiter({ maxRequests: 1, windowMs: 10_000 });
    limiter.consume();
    expect(limiter.isAllowed()).toBe(false);
    limiter.reset();
    expect(limiter.isAllowed()).toBe(true);
  });

  it('createRateLimiter factory works', () => {
    const limiter = createRateLimiter({ maxRequests: 10, windowMs: 5_000 });
    expect(limiter.getRemainingRequests()).toBe(10);
  });

  it('createGitHubRateLimiter uses 60 req/min defaults', () => {
    const limiter = createGitHubRateLimiter();
    expect(limiter.getRemainingRequests()).toBe(60);
  });
});
