import {
  withTiming,
  getTimings,
  clearTimings,
  formatTimingsMarkdown,
} from './timer';

describe('timer', () => {
  beforeEach(() => {
    clearTimings();
  });

  describe('withTiming', () => {
    it('returns the resolved value from the wrapped function', async () => {
      const result = await withTiming('test-op', async () => 42);
      expect(result.value).toBe(42);
    });

    it('records a non-negative durationMs', async () => {
      const result = await withTiming('test-op', async () => 'hello');
      expect(result.durationMs).toBeGreaterThanOrEqual(0);
    });

    it('stores the timing entry in the global list', async () => {
      await withTiming('alpha', async () => null);
      const timings = getTimings();
      expect(timings).toHaveLength(1);
      expect(timings[0].label).toBe('alpha');
    });

    it('records timing even when the function throws', async () => {
      await expect(
        withTiming('failing-op', async () => {
          throw new Error('boom');
        })
      ).rejects.toThrow('boom');

      const timings = getTimings();
      expect(timings).toHaveLength(1);
      expect(timings[0].durationMs).toBeGreaterThanOrEqual(0);
    });

    it('accumulates multiple timing entries', async () => {
      await withTiming('step-1', async () => 1);
      await withTiming('step-2', async () => 2);
      expect(getTimings()).toHaveLength(2);
    });
  });

  describe('clearTimings', () => {
    it('removes all recorded entries', async () => {
      await withTiming('x', async () => 0);
      clearTimings();
      expect(getTimings()).toHaveLength(0);
    });
  });

  describe('formatTimingsMarkdown', () => {
    it('returns a placeholder when no timings exist', () => {
      expect(formatTimingsMarkdown()).toBe('_No timings recorded._');
    });

    it('renders a markdown table with recorded timings', async () => {
      await withTiming('collect-commits', async () => null);
      const output = formatTimingsMarkdown();
      expect(output).toContain('| Step | Duration |');
      expect(output).toContain('collect-commits');
      expect(output).toMatch(/\d+ms/);
    });
  });
});
