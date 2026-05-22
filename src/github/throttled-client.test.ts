import { ThrottledClient, createThrottledClient } from './throttled-client';
import { RateLimiter } from '../utils/rate-limiter';

jest.mock('@octokit/rest', () => ({
  Octokit: jest.fn().mockImplementation(() => ({
    pulls: {
      get: jest.fn().mockResolvedValue({ data: { number: 42, body: 'existing' } }),
      update: jest.fn().mockResolvedValue({ data: { number: 42, body: 'updated' } }),
    },
  })),
}));

describe('ThrottledClient', () => {
  let client: ThrottledClient;
  let rateLimiter: RateLimiter;

  beforeEach(() => {
    rateLimiter = new RateLimiter({ maxRequests: 10, windowMs: 60_000 });
    client = new ThrottledClient({ token: 'test-token', rateLimiter });
  });

  it('getPullRequest returns PR data', async () => {
    const pr = await client.getPullRequest('owner', 'repo', 42);
    expect(pr.number).toBe(42);
  });

  it('updatePullRequest returns updated PR', async () => {
    const pr = await client.updatePullRequest('owner', 'repo', 42, 'updated body');
    expect(pr.body).toBe('updated');
  });

  it('consumes rate limiter slots on each call', async () => {
    const before = rateLimiter.getRemainingRequests();
    await client.getPullRequest('owner', 'repo', 1);
    await client.updatePullRequest('owner', 'repo', 1, 'body');
    expect(rateLimiter.getRemainingRequests()).toBe(before - 2);
  });

  it('throws when rate limiter is exhausted and cannot recover', async () => {
    const tinyLimiter = new RateLimiter({ maxRequests: 0, windowMs: 60_000 });
    const c = new ThrottledClient({ token: 'tok', rateLimiter: tinyLimiter });
    await expect(c.getPullRequest('o', 'r', 1)).rejects.toThrow();
  }, 15_000);

  it('getRateLimiter returns the limiter instance', () => {
    expect(client.getRateLimiter()).toBe(rateLimiter);
  });

  it('createThrottledClient factory creates a client', () => {
    const c = createThrottledClient('my-token');
    expect(c).toBeInstanceOf(ThrottledClient);
  });
});
