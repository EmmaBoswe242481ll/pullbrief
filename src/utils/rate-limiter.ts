export interface RateLimiterOptions {
  maxRequests: number;
  windowMs: number;
}

export interface RateLimiterState {
  count: number;
  windowStart: number;
}

export class RateLimiter {
  private state: RateLimiterState;
  private options: RateLimiterOptions;

  constructor(options: RateLimiterOptions) {
    this.options = options;
    this.state = { count: 0, windowStart: Date.now() };
  }

  isAllowed(): boolean {
    const now = Date.now();
    if (now - this.state.windowStart >= this.options.windowMs) {
      this.state = { count: 0, windowStart: now };
    }
    return this.state.count < this.options.maxRequests;
  }

  consume(): boolean {
    if (!this.isAllowed()) return false;
    this.state.count++;
    return true;
  }

  getRemainingRequests(): number {
    const now = Date.now();
    if (now - this.state.windowStart >= this.options.windowMs) {
      return this.options.maxRequests;
    }
    return Math.max(0, this.options.maxRequests - this.state.count);
  }

  getResetTimeMs(): number {
    return Math.max(0, this.options.windowMs - (Date.now() - this.state.windowStart));
  }

  reset(): void {
    this.state = { count: 0, windowStart: Date.now() };
  }
}

export function createRateLimiter(options: RateLimiterOptions): RateLimiter {
  return new RateLimiter(options);
}

export function createGitHubRateLimiter(): RateLimiter {
  return new RateLimiter({ maxRequests: 60, windowMs: 60_000 });
}
