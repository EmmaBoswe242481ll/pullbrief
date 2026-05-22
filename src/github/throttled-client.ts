import { Octokit } from '@octokit/rest';
import { RateLimiter, createGitHubRateLimiter } from '../utils/rate-limiter';
import { log } from '../utils/logger';
import { wrapError } from '../utils/errors';

export interface ThrottledClientOptions {
  token: string;
  rateLimiter?: RateLimiter;
}

export class ThrottledClient {
  private octokit: Octokit;
  private rateLimiter: RateLimiter;

  constructor(options: ThrottledClientOptions) {
    this.octokit = new Octokit({ auth: options.token });
    this.rateLimiter = options.rateLimiter ?? createGitHubRateLimiter();
  }

  private async waitForSlot(): Promise<void> {
    const maxAttempts = 10;
    for (let i = 0; i < maxAttempts; i++) {
      if (this.rateLimiter.consume()) return;
      const waitMs = this.rateLimiter.getResetTimeMs() + 100;
      log('warn', `Rate limit reached. Waiting ${waitMs}ms before retry.`);
      await new Promise((r) => setTimeout(r, waitMs));
    }
    throw wrapError(new Error('Rate limiter exhausted after max retries'), 'ThrottledClient');
  }

  async getPullRequest(owner: string, repo: string, pull_number: number) {
    await this.waitForSlot();
    try {
      const { data } = await this.octokit.pulls.get({ owner, repo, pull_number });
      return data;
    } catch (err) {
      throw wrapError(err as Error, 'ThrottledClient.getPullRequest');
    }
  }

  async updatePullRequest(owner: string, repo: string, pull_number: number, body: string) {
    await this.waitForSlot();
    try {
      const { data } = await this.octokit.pulls.update({ owner, repo, pull_number, body });
      return data;
    } catch (err) {
      throw wrapError(err as Error, 'ThrottledClient.updatePullRequest');
    }
  }

  getRateLimiter(): RateLimiter {
    return this.rateLimiter;
  }
}

export function createThrottledClient(token: string): ThrottledClient {
  return new ThrottledClient({ token });
}
